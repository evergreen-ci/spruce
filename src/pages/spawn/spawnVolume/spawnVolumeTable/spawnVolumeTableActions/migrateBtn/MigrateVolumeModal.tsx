import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Footer } from "@leafygreen-ui/modal";
import { useSpawnAnalytics } from "analytics";
import { DisplayModal, DisplayModalProps } from "components/DisplayModal";
import {
  formToGql,
  getFormSchema,
  ModalButtons,
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

interface MigrateVolumeModalProps
  extends Pick<DisplayModalProps, "open" | "setOpen"> {
  migrateVolumeId: string;
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
    setFormState,
    formState,
    disableExpirationCheckbox: formSchemaInput.disableExpirationCheckbox,
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

  return (
    <DisplayModal
      title={
        submitClickCount === 0
          ? "Migrate Volume"
          : "Are you sure you want to migrate this home volume?"
      }
      subtitle="Upon successful migration, the unused host will be scheduled to expire in 24 hours"
      open={open}
      setOpen={setOpen}
      data-cy="spawn-host-modal"
    >
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
      {submitClickCount === 1 &&
        "Migrating home volume would delete the existing workstation the volume is linked to."}
      <StyledFooter>
        <ModalButtons
          disableSubmit={
            !validateSpawnHostForm(formState, true) || loadingMigration
          }
          loading={loadingMigration}
          onCancel={
            submitClickCount === 0
              ? () => setOpen(false)
              : () => setSubmitClickCount(0)
          }
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitClickCount(submitClickCount + 1);
          }}
          submitButtonCopy={submitClickCount === 0 ? "Next" : "Migrate"}
          submitButtonLoadingCopy="Spawning"
        />
      </StyledFooter>
    </DisplayModal>
  );
};

const StyledFooter = styled(Footer)`
  margin-top: 8px;
`;
