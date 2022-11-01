import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { Body } from "@leafygreen-ui/typography";
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
  MigrateVolumeMutation,
  MigrateVolumeMutationVariables,
} from "gql/generated/types";
import { MIGRATE_VOLUME } from "gql/mutations";
import { omit } from "utils/object";

interface MigrateVolumeModalProps {
  migrateVolumeId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MigrateVolumeModal: React.VFC<MigrateVolumeModalProps> = ({
  open,
  setOpen,
  migrateVolumeId,
}) => {
  const [submitClickCount, setSubmitClickCount] = useState(0);
  const dispatchToast = useToastContext();
  const { sendEvent } = useSpawnAnalytics();

  const { formSchemaInput, loading: loadingFormData } = useLoadFormSchemaData();
  const [migrateVolumeMutation, { loading: loadingMigration }] = useMutation<
    MigrateVolumeMutation,
    MigrateVolumeMutationVariables
  >(MIGRATE_VOLUME, {
    onCompleted() {
      dispatchToast.success(
        "Volume migration has been scheduled. A new host will be spawned and accessible on your Hosts page."
      );
      setOpen(false);
    },
    onError(err) {
      dispatchToast.error(
        `There was an error during volume migration: ${err.message}`
      );
      setSubmitClickCount(0);
    },
    refetchQueries: ["MyHosts", "MyVolumes", "GetMyPublicKeys"],
  });
  const [formState, setFormState] = useState<FormState>({});

  const distros = useMemo(
    () => formSchemaInput.distros?.filter((d) => d.isVirtualWorkStation),
    [formSchemaInput.distros]
  );
  const { schema, uiSchema } = getFormSchema({
    ...formSchemaInput,
    distros,
    isMigration: true,
    isVirtualWorkstation: !!formState?.distro?.isVirtualWorkstation,
  });
  useVirtualWorkstationDefaultExpiration({
    disableExpirationCheckbox: false,
    formState,
    setFormState,
  });

  useEffect(() => {
    if (!open) {
      setFormState({});
    }
  }, [open]);

  const migrateVolume = useCallback(() => {
    const mutationInput = formToGql({
      formData: formState,
      myPublicKeys: formSchemaInput.myPublicKeys,
      migrateVolumeId,
    });
    sendEvent({
      name: "Spawned a host",
      isMigration: true,
      params: omit(mutationInput, [
        "publicKey",
        "userDataScript",
        "setUpScript",
      ]),
    });
    migrateVolumeMutation({
      variables: {
        spawnHostInput: mutationInput,
        volumeId: migrateVolumeId,
      },
    });
  }, [
    formSchemaInput.myPublicKeys,
    formState,
    migrateVolumeId,
    migrateVolumeMutation,
    sendEvent,
  ]);

  useEffect(() => {
    if (submitClickCount === 2) {
      migrateVolume();
    }
  }, [setSubmitClickCount, migrateVolume, submitClickCount]);

  if (loadingFormData) {
    return null;
  }
  const title =
    submitClickCount === 0
      ? "Migrate Volume"
      : "Are you sure you want to migrate this home volume?";

  let buttonText = "Migrate";
  if (loadingMigration) {
    buttonText = "Migrating";
  } else if (submitClickCount === 0) {
    buttonText = "Next";
  }

  return (
    <ConfirmationModal
      title={title}
      open={open}
      submitDisabled={
        !validateSpawnHostForm(formState, true) || loadingMigration
      }
      onConfirm={() => setSubmitClickCount(submitClickCount + 1)}
      data-cy="migrate-modal"
      buttonText={buttonText}
      onCancel={
        submitClickCount === 0
          ? () => setOpen(false)
          : () => setSubmitClickCount(0)
      }
    >
      <Body>
        Migrate this home volume to a new host. Upon successful migration, the
        unused host will be scheduled to expire in 24 hours.
      </Body>
      {submitClickCount === 0 && (
        <SpruceForm
          schema={schema}
          uiSchema={uiSchema}
          formData={formState}
          onChange={({ formData }) => {
            setFormState(formData);
          }}
        />
      )}
    </ConfirmationModal>
  );
};
