import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { diff } from "deep-object-diff";
import { useSpawnAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import {
  FormState,
  formToGql,
  getFormSchema,
} from "components/Spawn/editVolumeModal";
import { useLoadFormData } from "components/Spawn/spawnVolumeModal";
import { SpruceForm } from "components/SpruceForm";
import { useToastContext } from "context/toast";
import {
  UpdateVolumeMutation,
  UpdateVolumeMutationVariables,
} from "gql/generated/types";
import { UPDATE_SPAWN_VOLUME } from "gql/mutations";
import { TableVolume } from "types/spawn";

interface Props {
  visible: boolean;
  onCancel: () => void;
  volume: TableVolume;
}

export const EditVolumeModal: React.VFC<Props> = ({
  visible,
  onCancel,
  volume,
}) => {
  const dispatchToast = useToastContext();
  const spawnAnalytics = useSpawnAnalytics();

  const [updateVolumeMutation, { loading }] = useMutation<
    UpdateVolumeMutation,
    UpdateVolumeMutationVariables
  >(UPDATE_SPAWN_VOLUME, {
    onCompleted() {
      onCancel();
      dispatchToast.success("Successfully updated volume");
    },
    onError(err) {
      onCancel();

      dispatchToast.error(
        `There was an error while updating your volume: ${err.message}`
      );
    },
    refetchQueries: ["MyVolumes", "MyHosts"],
  });

  const initialState = useMemo(
    () => ({
      expirationDetails: {
        expiration: volume?.expiration?.toString(),
        noExpiration: volume.noExpiration,
      },
      name: volume.displayName,
    }),
    [volume]
  );
  const [formState, setFormState] = useState<FormState>(initialState);
  const [formErrors, setFormErrors] = useState([]);

  const updateVolume = () => {
    const mutationInput = formToGql(initialState, formState, volume.id);
    spawnAnalytics.sendEvent({
      name: "Edited a Spawn Volume",
      params: mutationInput,
    });
    updateVolumeMutation({
      variables: { UpdateVolumeInput: mutationInput },
    });
  };

  const { disableExpirationCheckbox, noExpirationCheckboxTooltip } =
    useLoadFormData();
  const { schema, uiSchema } = getFormSchema({
    disableExpirationCheckbox,
    noExpirationCheckboxTooltip,
  });

  const [hasChanges, setHasChanges] = useState(false);
  useEffect(() => {
    const changes = diff(initialState, formState);
    setHasChanges(Object.entries(changes).length > 0);
  }, [formState, initialState]);

  return (
    <ConfirmationModal
      title="Edit Volume"
      open={visible}
      onCancel={onCancel}
      submitDisabled={loading || !hasChanges || !!formErrors.length}
      buttonText={loading ? "Saving" : "Save"}
      onConfirm={updateVolume}
      data-cy="update-volume-modal"
    >
      <SpruceForm
        schema={schema}
        uiSchema={uiSchema}
        formData={formState}
        onChange={({ formData, errors }) => {
          setFormState(formData);
          setFormErrors(errors);
        }}
      />
    </ConfirmationModal>
  );
};
