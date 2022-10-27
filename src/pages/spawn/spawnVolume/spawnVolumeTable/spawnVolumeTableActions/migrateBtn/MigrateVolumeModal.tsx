import { SyntheticEvent, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Footer } from "@leafygreen-ui/modal";
import { useSpawnAnalytics } from "analytics";
import { DisplayModal, DisplayModalProps } from "components/DisplayModal";
import { getFormSchema } from "components/Spawn/spawnHostModal/getFormSchema";
import { ModalButtons } from "components/Spawn/spawnHostModal/ModalButtons";
import { formToGql } from "components/Spawn/spawnHostModal/transformer";
import { FormState } from "components/Spawn/spawnHostModal/types";
import { useLoadFormSchemaData } from "components/Spawn/spawnHostModal/useLoadFormSchemaData";
import { useVirtualWorkstationDefaultExpiration } from "components/Spawn/spawnHostModal/useVirtualWorkstationDefaultExpiration";
import { validateSpawnHostForm } from "components/Spawn/spawnHostModal/utils";
import { SpruceForm } from "components/SpruceForm";
import { useToastContext } from "context/toast";
import {
  MigrateVolumeMutation,
  MigrateVolumeMutationVariables,
} from "gql/generated/types";
import { MIGRATE_VOLUME } from "gql/mutations";
import { omit } from "utils/object";

interface SpawnHostModalProps
  extends Pick<DisplayModalProps, "open" | "setOpen"> {
  migrateVolumeId: string;
}

export const MigrateVolumeModal: React.VFC<SpawnHostModalProps> = ({
  open,
  setOpen,
  migrateVolumeId,
}) => {
  const dispatchToast = useToastContext();
  const spawnAnalytics = useSpawnAnalytics();

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
    },
    refetchQueries: ["MyHosts", "MyVolumes", "GetMyPublicKeys"],
  });
  const [formState, setFormState] = useState<FormState>({});
  const { schema, uiSchema } = getFormSchema({
    ...formSchemaInput,
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

  if (loadingFormData) {
    return null;
  }

  const spawnHost = (e: SyntheticEvent) => {
    e.preventDefault();
    const mutationInput = formToGql({
      formData: formState,
      myPublicKeys: formSchemaInput.myPublicKeys,
      migrateVolumeId,
    });
    spawnAnalytics.sendEvent({
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
  };

  return (
    <DisplayModal
      title="Migrate Volume"
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
            !validateSpawnHostForm(formState, true) || loadingMigration
          }
          loading={loadingMigration}
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
