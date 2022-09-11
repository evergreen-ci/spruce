import { useEffect, useState } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { useSpawnAnalytics } from "analytics";
import { Modal } from "components/Modal";
import { ModalContent } from "components/Spawn";
import { SpruceForm } from "components/SpruceForm";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  DistrosQuery,
  DistrosQueryVariables,
  GetMyPublicKeysQuery,
  GetMyPublicKeysQueryVariables,
  AwsRegionsQuery,
  AwsRegionsQueryVariables,
  MyVolumesQuery,
  MyHostsQueryVariables,
  SpawnHostMutation,
  SpawnHostMutationVariables,
  GetUserSettingsQuery,
} from "gql/generated/types";
import { SPAWN_HOST } from "gql/mutations";
import {
  GET_DISTROS,
  GET_MY_PUBLIC_KEYS,
  GET_AWS_REGIONS,
  GET_MY_VOLUMES,
  GET_USER_SETTINGS,
  GET_SPAWN_TASK,
} from "gql/queries";
import {
  GetSpawnTaskQuery,
  GetSpawnTaskQueryVariables,
} from "gql/generated/types";
import { queryString } from "utils";
import { useDisableSpawnExpirationCheckbox } from "hooks";
import { string } from "utils";
import {
  HostDetailsForm,
  useSpawnHostModalState,
} from "../spawnHostModal/index";
import { getFormSchema } from "./getFormSchema";
import { useLocation } from "react-router-dom";
import { getString, parseQueryString } from "utils/queryString";

const { omitTypename, stripNewLines } = string;
interface SpawnHostModalProps {
  visible: boolean;
  onCancel: () => void;
}

export const SpawnHostModal: React.VFC<SpawnHostModalProps> = ({
  visible,
  onCancel,
}) => {
  const dispatchToast = useToastContext();
  const spawnAnalytics = useSpawnAnalytics();
  const { search } = useLocation();
  const queryParams = parseQueryString(search);
  const taskIdQueryParam = getString(queryParams.taskId);
  const distroIdQueryParam = getString(queryParams.distroId);

  const [getSpawnTask, { data: spawnTaskData }] = useLazyQuery<
    GetSpawnTaskQuery,
    GetSpawnTaskQueryVariables
  >(GET_SPAWN_TASK);

  useEffect(() => {
    if (taskIdQueryParam && distroIdQueryParam) {
      getSpawnTask({ variables: { taskId: taskIdQueryParam, execution: 0 } });
    }
  }, [taskIdQueryParam, distroIdQueryParam, getSpawnTask]);

  // QUERY distros
  const { data: distrosData, loading: distroLoading } = useQuery<
    DistrosQuery,
    DistrosQueryVariables
  >(GET_DISTROS, {
    variables: {
      onlySpawnable: true,
    },
  });

  // QUERY aws regions
  const { data: awsData, loading: awsLoading } = useQuery<
    AwsRegionsQuery,
    AwsRegionsQueryVariables
  >(GET_AWS_REGIONS);

  // QUERY user settings to get user's preferred aws region
  const { data: userSettingsData } =
    useQuery<GetUserSettingsQuery>(GET_USER_SETTINGS);
  const { region: userAwsRegion } = userSettingsData?.userSettings ?? {};

  // QUERY public keys
  const { data: publicKeysData, loading: publicKeyLoading } = useQuery<
    GetMyPublicKeysQuery,
    GetMyPublicKeysQueryVariables
  >(GET_MY_PUBLIC_KEYS);

  // QUERY volumes
  const { data: volumesData, loading: volumesLoading } = useQuery<
    MyVolumesQuery,
    MyHostsQueryVariables
  >(GET_MY_VOLUMES);

  // UPDATE HOST STATUS MUTATION
  const [spawnHostMutation, { loading: loadingSpawnHost }] = useMutation<
    SpawnHostMutation,
    SpawnHostMutationVariables
  >(SPAWN_HOST, {
    onCompleted(hostMutation) {
      const { id } = hostMutation?.spawnHost ?? {};
      onCancel();
      dispatchToast.success(`Successfully spawned host: ${id}`);
    },
    onError(err) {
      onCancel();
      dispatchToast.error(
        `There was an error while spawning your host: ${err.message}`
      );
    },
    refetchQueries: ["MyHosts", "MyVolumes", "GetMyPublicKeys"],
  });

  const { reducer } = useSpawnHostModalState();
  const [spawnHostModalState, dispatch] = reducer;

  const { distroId, region, publicKey } = spawnHostModalState;

  const publicKeys = publicKeysData?.myPublicKeys;
  const awsRegions = awsData?.awsRegions;
  const volumes = volumesData?.myVolumes ?? [];

  // When the modal is opened, pre-fill parts of the form (AWS region, public key, and expiration).
  useEffect(() => {
    if (awsRegions && awsRegions.length) {
      dispatch({
        type: "editAWSRegion",
        region: userAwsRegion || awsRegions[0],
      });
    }
    if (publicKeys && publicKeys.length) {
      dispatch({
        type: "editPublicKey",
        publicKey: publicKeys[0],
        savePublicKey: false,
      });
    }
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    dispatch({
      type: "editExpiration",
      expiration: futureDate,
      noExpiration: false,
    });
  }, [visible, userAwsRegion, awsRegions, publicKeys]); // eslint-disable-line react-hooks/exhaustive-deps

  const unexpirableCountReached = useDisableSpawnExpirationCheckbox(false);

  // recalculate isVirtualWorkstation whenever distro changes
  // initial distroId can be changed from URL
  useEffect(() => {
    const isVirtualWorkstation = !!distrosData?.distros.find(
      (vd) => distroId === vd.name
    )?.isVirtualWorkStation;
    dispatch({
      type: "editDistroEffect",
      isVirtualWorkstation,
      noExpiration: isVirtualWorkstation && !unexpirableCountReached, // only default virtual workstations to unexpirable if possible
    });
  }, [distroId, dispatch, distrosData?.distros, unexpirableCountReached]);

  const { schema, uiSchema } = getFormSchema({
    distros: distrosData?.distros,
    awsRegions,
    userAwsRegion,
    publicKeys,
    spawnTaskData: spawnTaskData?.task,
  });
  const [formState, setFormState] = useState();
  if (distroLoading || publicKeyLoading || awsLoading || volumesLoading) {
    return null;
  }

  const canSubmitSpawnHost = !(
    distroId === "" ||
    region === "" ||
    publicKey?.key === ""
  );

  const spawnHost = (e) => {
    e.preventDefault();

    // Remove new lines from public key on submit
    const { publicKey: keyToSubmit } = spawnHostModalState;
    const varsToSubmit = omitTypename({
      ...spawnHostModalState,
      publicKey: {
        name: keyToSubmit.name,
        key: stripNewLines(keyToSubmit.key),
      },
    });

    spawnAnalytics.sendEvent({
      name: "Spawned a host",
      params: varsToSubmit,
    });
    spawnHostMutation({
      variables: { SpawnHostInput: varsToSubmit },
    });
  };

  const onClose = () => {
    dispatch({ type: "reset" }); // reset modal content
    onCancel();
  };

  return (
    <Modal
      title="Spawn New Host"
      visible={visible}
      onCancel={onClose}
      footer={[
        // @ts-expect-error
        <WideButton onClick={onClose} key="cancel_button">
          Cancel
        </WideButton>,
        <WideButton
          data-cy="spawn-host-button"
          disabled={!canSubmitSpawnHost || loadingSpawnHost} // @ts-expect-error
          onClick={spawnHost}
          variant={Variant.Primary}
          key="spawn_host_button"
        >
          {loadingSpawnHost ? "Spawning Host" : "Spawn"}
        </WideButton>,
      ]}
      data-cy="spawn-host-modal"
    >
      <div>
        <SpruceForm
          schema={schema}
          uiSchema={uiSchema}
          formData={formState}
          onChange={({ formData }) => {
            console.log(formData);
            setFormState(formData);
          }}
        />
      </div>
      <ModalContent>
        <HostDetailsForm
          data={spawnHostModalState}
          onChange={dispatch}
          volumes={volumes}
          isSpawnHostModal
        />
      </ModalContent>
    </Modal>
  );
};

// @ts-expect-error
const WideButton = styled(Button)`
  justify-content: center;
  margin-left: ${size.s};
  width: 140px;
`;
