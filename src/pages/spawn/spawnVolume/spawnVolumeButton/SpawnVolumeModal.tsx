import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useSpawnAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import {
  FormState,
  formToGql,
  getFormSchema,
  useLoadFormData,
} from "components/Spawn/spawnVolumeModal";
import { SpruceForm } from "components/SpruceForm";
import { useToastContext } from "context/toast";
import {
  SpawnVolumeMutation,
  SpawnVolumeMutationVariables,
} from "gql/generated/types";
import { SPAWN_VOLUME } from "gql/mutations";
import { HostStatus } from "types/host";

interface SpawnVolumeModalProps {
  visible: boolean;
  onCancel: () => void;
  maxSpawnableLimit: number;
}

export const SpawnVolumeModal: React.VFC<SpawnVolumeModalProps> = ({
  visible,
  onCancel,
  maxSpawnableLimit,
}) => {
  const spawnAnalytics = useSpawnAnalytics();
  const dispatchToast = useToastContext();

  const closeModal = () => {
    onCancel();
    setFormState({});
  };

  const [spawnVolumeMutation, { loading: loadingSpawnVolume }] = useMutation<
    SpawnVolumeMutation,
    SpawnVolumeMutationVariables
  >(SPAWN_VOLUME, {
    onCompleted() {
      dispatchToast.success("Successfully spawned volume");
    },
    onError(err) {
      dispatchToast.error(
        `There was an error while spawning your volume: ${err.message}`
      );
    },
    refetchQueries: ["MyVolumes"],
  });

  const spawnVolume = () => {
    const mutationInput = formToGql({ formData: formState });
    spawnAnalytics.sendEvent({
      name: "Spawned a volume",
      params: mutationInput,
    });
    spawnVolumeMutation({
      variables: { SpawnVolumeInput: mutationInput },
    });
  };

  const {
    availabilityZones,
    types,
    hosts,
    disableExpirationCheckbox,
    noExpirationCheckboxTooltip,
    loadingFormData,
  } = useLoadFormData();

  const [formState, setFormState] = useState<FormState>({});

  const availableHosts = hosts
    .filter(
      ({ availabilityZone, status }) =>
        availabilityZone ===
          formState?.requiredVolumeInformation?.availabilityZone &&
        (status === HostStatus.Running || status === HostStatus.Stopped)
    )
    .map(({ id, displayName }) => ({ id, displayName }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  const { schema, uiSchema } = getFormSchema({
    maxSpawnableLimit,
    availabilityZones,
    types,
    hosts: availableHosts,
    disableExpirationCheckbox,
    noExpirationCheckboxTooltip,
  });

  if (loadingFormData) {
    return null;
  }

  return (
    <ConfirmationModal
      title="Spawn New Volume"
      open={visible}
      onCancel={closeModal}
      buttonText={loadingSpawnVolume ? "Spawning volume" : "Spawn"}
      onConfirm={() => {
        spawnVolume();
        closeModal();
      }}
      submitDisabled={
        loadingSpawnVolume ||
        !formState?.requiredVolumeInformation?.volumeSize ||
        formState?.requiredVolumeInformation?.volumeSize > maxSpawnableLimit
      }
      data-cy="spawn-volume-modal"
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
