import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { Footer } from "@leafygreen-ui/modal";
import { useLocation } from "react-router-dom";
import { useSpawnAnalytics } from "analytics";
import { DisplayModal, DisplayModalProps } from "components/DisplayModal";
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
  usePrevious,
  useSpruceConfig,
} from "hooks";
import { useUserTimeZone } from "hooks/useUserTimeZone";
import { omit } from "utils/object";
import { getString, parseQueryString } from "utils/queryString";
import {
  getDefaultExpiration,
  getFormSchema,
} from "./spawnHostModal/getFormSchema";
import { formToGql } from "./spawnHostModal/transformer";
import { FormState } from "./spawnHostModal/types";
import { validateSpawnHostForm } from "./spawnHostModal/utils";

interface SpawnHostModalProps
  extends Pick<DisplayModalProps, "open" | "setOpen"> {
  onCloseCb: () => void;
}

export const SpawnHostModal: React.VFC<SpawnHostModalProps> = ({
  open,
  setOpen,
  onCloseCb,
}) => {
  const dispatchToast = useToastContext();
  const spawnAnalytics = useSpawnAnalytics();

  // Handle distroId, taskId query param
  const { search } = useLocation();
  const queryParams = parseQueryString(search);
  const taskIdQueryParam = getString(queryParams.taskId);
  const distroIdQueryParam = getString(queryParams.distroId);
  const { data: spawnTaskData } = useQuery<
    GetSpawnTaskQuery,
    GetSpawnTaskQueryVariables
  >(GET_SPAWN_TASK, {
    skip: !(taskIdQueryParam && distroIdQueryParam),
    variables: { taskId: taskIdQueryParam },
  });

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
      dispatchToast.success(`Successfully spawned host: ${id}`);
      setOpen(false);
    },
    onError(err) {
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
  const [formState, setFormState] = useState<FormState>({});
  const timezone = useUserTimeZone();
  const isVirtualWorkstation = !!formState?.distro?.isVirtualWorkstation;
  const { schema, uiSchema } = getFormSchema({
    awsRegions: awsData?.awsRegions,
    disableExpirationCheckbox,
    distroIdQueryParam,
    distros: distrosData?.distros,
    isVirtualWorkstation,
    noExpirationCheckboxTooltip,
    publicKeys: publicKeysData?.myPublicKeys,
    spawnTaskData: spawnTaskData?.task,
    timezone,
    userAwsRegion,
    volumes: volumesData?.myVolumes ?? [],
  });
  // Default virtual workstations to unexpirable upon selection if possible
  const prevIsVirtualWorkStation = usePrevious(isVirtualWorkstation);
  useEffect(() => {
    if (isVirtualWorkstation && !prevIsVirtualWorkStation) {
      setFormState({
        ...formState,
        expirationDetails: {
          noExpiration: isVirtualWorkstation && !disableExpirationCheckbox,
          expiration: getDefaultExpiration(),
        },
      });
    }
  }, [
    isVirtualWorkstation,
    disableExpirationCheckbox,
    formState,
    prevIsVirtualWorkStation,
  ]);
  useEffect(() => {
    if (!open) {
      setFormState({});
      onCloseCb();
    }
  }, [open, onCloseCb]);

  if (distroLoading || publicKeyLoading || awsLoading || volumesLoading) {
    return null;
  }

  const spawnHost = (e) => {
    e.preventDefault();
    const mutationInput = formToGql({
      formData: formState,
      publicKeys: publicKeysData?.myPublicKeys,
      spawnTaskData: spawnTaskData?.task,
    });
    spawnAnalytics.sendEvent({
      name: "Spawned a host",
      params: omit(mutationInput, [
        "publicKey",
        "userDataScript",
        "setUpScript",
      ]),
    });
    spawnHostMutation({
      variables: { SpawnHostInput: mutationInput },
    });
  };

  return (
    <DisplayModal
      title="Spawn New Host"
      open={open}
      setOpen={setOpen}
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
      <StyledFooter>
        <WideButton
          // @ts-expect-error
          onClick={() => setOpen(false)}
          data-cy="cancel-button"
          key="cancel_button"
        >
          Cancel
        </WideButton>
        <WideButton
          data-cy="spawn-host-button"
          disabled={!validateSpawnHostForm(formState) || loadingSpawnHost} // @ts-expect-error
          onClick={spawnHost}
          variant={Variant.Primary}
          key="spawn_host_button"
        >
          {loadingSpawnHost ? "Spawning Host" : "Spawn"}
        </WideButton>
      </StyledFooter>
    </DisplayModal>
  );
};

// @ts-expect-error
const WideButton = styled(Button)`
  justify-content: center;
  margin-left: ${size.s};
  width: 140px;
`;

const StyledFooter = styled(Footer)`
  margin-top: 8px;
`;
