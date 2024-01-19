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

export const SpawnVolumeModal: React.FC<SpawnVolumeModalProps> = ({
  maxSpawnableLimit,
  onCancel,
  visible,
}) => {
  const spawnAnalytics = useSpawnAnalytics();
  const dispatchToast = useToastContext();

  const [spawnVolumeMutation, { loading: loadingSpawnVolume }] = useMutation<
    SpawnVolumeMutation,
    SpawnVolumeMutationVariables
  >(SPAWN_VOLUME, {
    onCompleted() {
      dispatchToast.success("Successfully spawned volume");
      onCancel();
    },
    onError(err) {
      dispatchToast.error(
        `There was an error while spawning your volume: ${err.message}`,
      );
      onCancel();
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
      variables: { spawnVolumeInput: mutationInput },
    });
  };

  const {
    availabilityZones,
    disableExpirationCheckbox,
    hosts,
    loadingFormData,
    noExpirationCheckboxTooltip,
    types,
  } = useLoadFormData();

  const [canSubmit, setCanSubmit] = useState(true);
  const [formState, setFormState] = useState<FormState>({});

  const availableHosts = hosts
    .filter(
      ({ availabilityZone, status }) =>
        availabilityZone ===
          formState?.requiredVolumeInformation?.availabilityZone &&
        (status === HostStatus.Running || status === HostStatus.Stopped),
    )
    .map(({ displayName, id }) => ({ id, displayName }))
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
      onCancel={onCancel}
      buttonText={loadingSpawnVolume ? "Spawning volume" : "Spawn"}
      onConfirm={spawnVolume}
      submitDisabled={loadingSpawnVolume || !canSubmit}
      data-cy="spawn-volume-modal"
    >
      <SpruceForm
        schema={schema}
        uiSchema={uiSchema}
        formData={formState}
        onChange={({ errors, formData }) => {
          setFormState(formData);
          setCanSubmit(errors.length === 0);
        }}
      />
    </ConfirmationModal>
  );
};
