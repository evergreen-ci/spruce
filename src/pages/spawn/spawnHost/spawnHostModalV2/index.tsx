import { useEffect, useState } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { useSpawnAnalytics } from "analytics";
import { Modal } from "components/Modal";
import { formToGql } from "./transformer";
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
import { useDisableSpawnExpirationCheckbox, useSpruceConfig } from "hooks";
import { string } from "utils";
import { useSpawnHostModalState } from "../spawnHostModal/index";
import { getFormSchema } from "./getFormSchema";
import { useLocation } from "react-router-dom";
import { getString, parseQueryString } from "utils/queryString";
import { useUserTimeZone } from "hooks/useUserTimeZone";
import { getNoExpirationCheckboxTooltipCopy } from "components/Spawn/utils";

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

  const spruceConfig = useSpruceConfig();
  const disableExpirationCheckbox = useDisableSpawnExpirationCheckbox(false);

  const [getSpawnTask, { data: spawnTaskData }] = useLazyQuery<
    GetSpawnTaskQuery,
    GetSpawnTaskQueryVariables
  >(GET_SPAWN_TASK);

  useEffect(() => {
    if (taskIdQueryParam && distroIdQueryParam) {
      getSpawnTask({ variables: { taskId: taskIdQueryParam, execution: 0 } });
    }
  }, [taskIdQueryParam, distroIdQueryParam, getSpawnTask]);

  const { data: distrosData, loading: distroLoading } = useQuery<
    DistrosQuery,
    DistrosQueryVariables
  >(GET_DISTROS, {
    variables: {
      onlySpawnable: true,
    },
  });

  const { data: awsData, loading: awsLoading } = useQuery<
    AwsRegionsQuery,
    AwsRegionsQueryVariables
  >(GET_AWS_REGIONS);

  const { data: userSettingsData } =
    useQuery<GetUserSettingsQuery>(GET_USER_SETTINGS);
  const { region: userAwsRegion } = userSettingsData?.userSettings ?? {};

  const { data: publicKeysData, loading: publicKeyLoading } = useQuery<
    GetMyPublicKeysQuery,
    GetMyPublicKeysQueryVariables
  >(GET_MY_PUBLIC_KEYS);

  const { data: volumesData, loading: volumesLoading } = useQuery<
    MyVolumesQuery,
    MyHostsQueryVariables
  >(GET_MY_VOLUMES);

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

  const timezone = useUserTimeZone();
  const noExpirationCheckboxTooltip = getNoExpirationCheckboxTooltipCopy({
    disableExpirationCheckbox,
    limit: spruceConfig?.spawnHost?.unexpirableHostsPerUser,
    isVolume: false,
  });
  const [formState, setFormState] = useState({} as any);
  const { schema, uiSchema } = getFormSchema({
    distros: distrosData?.distros,
    awsRegions: awsData?.awsRegions,
    userAwsRegion,
    publicKeys: publicKeysData?.myPublicKeys,
    spawnTaskData: spawnTaskData?.task,
    timezone,
    noExpirationCheckboxTooltip,
    disableExpirationCheckbox,
    isVirtualWorkstation: !!formState?.distro?.schema?.isVirtualWorkstation,
    volumes: volumesData?.myVolumes ?? [],
  });
  if (distroLoading || publicKeyLoading || awsLoading || volumesLoading) {
    return null;
  }

  // Distro, region, and public key are spawn requirements
  const canSubmitSpawnHost =
    formState?.distro?.value &&
    formState?.region &&
    (formState?.publicKeySection?.useExisting
      ? formState?.publicKeySection?.publicKeyNameDropdown
      : formState?.publicKeySection?.newPublicKey);

  const spawnHost = (e) => {
    e.preventDefault();

    // Remove new lines from public key on submit
    // const { publicKey: keyToSubmit } = spawnHostModalState;
    // const varsToSubmit = omitTypename({
    //   ...spawnHostModalState,
    //   publicKey: {
    //     name: keyToSubmit.name,
    //     key: stripNewLines(keyToSubmit.key),
    //   },
    // });

    // spawnAnalytics.sendEvent({
    //   name: "Spawned a host",
    //   params: varsToSubmit,
    // });
    // spawnHostMutation({
    //   variables: { SpawnHostInput: varsToSubmit },
    // });
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
    </Modal>
  );
};

// @ts-expect-error
const WideButton = styled(Button)`
  justify-content: center;
  margin-left: ${size.s};
  width: 140px;
`;
