import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { useSpawnAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import {
  formToGql,
  getFormSchema,
  useLoadFormSchemaData,
  useVirtualWorkstationDefaultExpiration,
  validateSpawnHostForm,
  FormState,
} from "components/Spawn/spawnHostModal";
import { SpruceForm } from "components/SpruceForm";
import { useToastContext } from "context/toast";
import {
  SpawnHostMutation,
  SpawnHostMutationVariables,
  SpawnTaskQuery,
  SpawnTaskQueryVariables,
} from "gql/generated/types";
import { SPAWN_HOST } from "gql/mutations";
import { SPAWN_TASK } from "gql/queries";
import { omit } from "utils/object";
import { getString, parseQueryString } from "utils/queryString";

interface SpawnHostModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SpawnHostModal: React.FC<SpawnHostModalProps> = ({
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
    SpawnTaskQuery,
    SpawnTaskQueryVariables
  >(SPAWN_TASK, {
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
        `There was an error while spawning your host: ${err.message}`,
      );
    },
    refetchQueries: ["MyHosts", "MyVolumes", "MyPublicKeys"],
  });

  const [formState, setFormState] = useState<FormState>({});

  useVirtualWorkstationDefaultExpiration({
    setFormState,
    formState,
    disableExpirationCheckbox: formSchemaInput.disableExpirationCheckbox,
  });

  const { schema, uiSchema } = getFormSchema({
    ...formSchemaInput,
    distroIdQueryParam,
    isMigration: false,
    isVirtualWorkstation: !!formState?.distro?.isVirtualWorkstation,
    spawnTaskData: spawnTaskData?.task,
    useSetupScript: !!formState?.setupScriptSection?.defineSetupScriptCheckbox,
    useProjectSetupScript: !!formState?.loadData?.runProjectSpecificSetupScript,
  });

  if (loadingFormData) {
    return null;
  }

  const spawnHost = () => {
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
      variables: { spawnHostInput: mutationInput },
    });
  };

  return (
    <ConfirmationModal
      title="Spawn New Host"
      open={open}
      data-cy="spawn-host-modal"
      submitDisabled={
        !validateSpawnHostForm(formState, false) || loadingSpawnHost
      }
      onCancel={() => {
        setOpen(false);
      }}
      onConfirm={spawnHost}
      buttonText={loadingSpawnHost ? "Spawning" : "Spawn a host"}
    >
      <SpruceForm
        schema={schema}
        uiSchema={uiSchema}
        formData={formState}
        onChange={({ formData }) => {
          setFormState(formData);
        }}
      />
    </ConfirmationModal>
  );
};
