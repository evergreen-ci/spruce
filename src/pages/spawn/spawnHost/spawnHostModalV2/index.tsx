import { useEffect, useState } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { useLocation } from "react-router-dom";
import { useSpawnAnalytics } from "analytics";
import { Modal } from "components/Modal";
import { getNoExpirationCheckboxTooltipCopy } from "components/Spawn/utils";
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
  GetSpawnTaskQuery,
  GetSpawnTaskQueryVariables,
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
  useDisableSpawnExpirationCheckbox,
  useSpruceConfig,
  useUpdateURLQueryParams,
} from "hooks";
import { useUserTimeZone } from "hooks/useUserTimeZone";
import { getString, parseQueryString } from "utils/queryString";
import { getFormSchema } from "./getFormSchema";
import { formToGql } from "./transformer";

interface SpawnHostModalProps {
  visible: boolean;
  onCancel: () => void;
}

export const SpawnHostModal: React.VFC<SpawnHostModalProps> = ({
  visible,
  onCancel,
}) => {
  const updateQueryParams = useUpdateURLQueryParams();
  const dispatchToast = useToastContext();
  const spawnAnalytics = useSpawnAnalytics();

  // Handle distroId, taskId query param
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

  const spruceConfig = useSpruceConfig();

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

  const disableExpirationCheckbox = useDisableSpawnExpirationCheckbox(false);
  const noExpirationCheckboxTooltip = getNoExpirationCheckboxTooltipCopy({
    disableExpirationCheckbox,
    limit: spruceConfig?.spawnHost?.unexpirableHostsPerUser,
    isVolume: false,
  });
  const [formState, setFormState] = useState({} as any);
  const timezone = useUserTimeZone();
  const { schema, uiSchema } = getFormSchema({
    awsRegions: awsData?.awsRegions,
    disableExpirationCheckbox,
    distroIdQueryParam,
    distros: distrosData?.distros,
    isVirtualWorkstation: !!formState?.distro?.isVirtualWorkstation,
    noExpirationCheckboxTooltip,
    publicKeys: publicKeysData?.myPublicKeys,
    spawnTaskData: spawnTaskData?.task,
    timezone,
    userAwsRegion,
    volumes: volumesData?.myVolumes ?? [],
  });

  const removeModalQueryParam = () =>
    updateQueryParams({ spawnHost: undefined });
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
    removeModalQueryParam();
    const mutationInput = formToGql({
      formData: formState,
      publicKeys: publicKeysData?.myPublicKeys,
      spawnTaskData: spawnTaskData?.task,
    });
    spawnAnalytics.sendEvent({
      name: "Spawned a host",
      params: mutationInput,
    });
    spawnHostMutation({
      variables: { SpawnHostInput: mutationInput },
    });
  };
  const onClose = () => {
    setFormState({});
    onCancel();
    removeModalQueryParam();
  };
  return (
    <Modal
      title="Spawn New Host"
      visible={visible}
      onCancel={onClose}
      footer={[
        <WideButton
          // @ts-expect-error
          onClick={onClose}
          data-cy="cancel-button"
          key="cancel_button"
        >
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
      <SpruceForm
        schema={schema}
        uiSchema={uiSchema}
        formData={formState}
        onChange={({ formData }) => {
          setFormState(formData);
        }}
      />
    </Modal>
  );
};

// @ts-expect-error
const WideButton = styled(Button)`
  justify-content: center;
  margin-left: ${size.s};
  width: 140px;
`;
