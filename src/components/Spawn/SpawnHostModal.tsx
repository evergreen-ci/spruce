import { SyntheticEvent, useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Footer } from "@leafygreen-ui/modal";
import { useLocation } from "react-router-dom";
import { useSpawnAnalytics } from "analytics";
import { DisplayModal, DisplayModalProps } from "components/DisplayModal";
import { SpruceForm } from "components/SpruceForm";
import { useToastContext } from "context/toast";
import {
  SpawnHostMutation,
  SpawnHostMutationVariables,
  GetSpawnTaskQuery,
  GetSpawnTaskQueryVariables,
} from "gql/generated/types";
import { SPAWN_HOST } from "gql/mutations";
import { GET_SPAWN_TASK } from "gql/queries";
import { omit } from "utils/object";
import { getString, parseQueryString } from "utils/queryString";
import { getFormSchema } from "./spawnHostModal/getFormSchema";
import { ModalButtons } from "./spawnHostModal/ModalButtons";
import { formToGql } from "./spawnHostModal/transformer";
import { FormState } from "./spawnHostModal/types";
import { useLoadFormSchemaData } from "./spawnHostModal/useLoadFormSchemaData";
import { useVirtualWorkstationDefaultExpiration } from "./spawnHostModal/useVirtualWorkstationDefaultExpiration";
import { validateSpawnHostForm } from "./spawnHostModal/utils";

interface SpawnHostModalProps
  extends Pick<DisplayModalProps, "open" | "setOpen"> {}

export const SpawnHostModal: React.VFC<SpawnHostModalProps> = ({
  open,
  setOpen,
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

  const { formSchemaInput, loading: loadingFormData } = useLoadFormSchemaData();

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

  const [formState, setFormState] = useState<FormState>({});

  useVirtualWorkstationDefaultExpiration({
    setFormState,
    formState,
    disableExpirationCheckbox: formSchemaInput.disableExpirationCheckbox,
  });

  const { schema, uiSchema } = getFormSchema({
    ...formSchemaInput,
    isMigration: false,
    isVirtualWorkstation: !!formState?.distro?.isVirtualWorkstation,
    spawnTaskData: spawnTaskData?.task,
  });

  useEffect(() => {
    if (!open) {
      setFormState({});
    }
  }, [open]);

  if (loadingFormData) {
    return null;
  }

  const spawnHost = (e: SyntheticEvent) => {
    e.preventDefault();
    const mutationInput = formToGql({
      formData: formState,
      myPublicKeys: formSchemaInput.myPublicKeys,
      spawnTaskData: spawnTaskData?.task,
    });
    spawnAnalytics.sendEvent({
      name: "Spawned a host",
      isMigration: false,
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
        <ModalButtons
          disableSubmit={
            !validateSpawnHostForm(formState, false) || loadingSpawnHost
          }
          loading={loadingSpawnHost}
          onCancel={() => setOpen(false)}
          onSubmit={spawnHost}
        />
      </StyledFooter>
    </DisplayModal>
  );
};

const StyledFooter = styled(Footer)`
  margin-top: 8px;
`;
