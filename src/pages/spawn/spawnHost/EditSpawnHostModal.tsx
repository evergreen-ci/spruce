import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useSpawnAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import {
  FormState,
  computeDiff,
  formToGql,
  getFormSchema,
  useLoadFormData,
} from "components/Spawn/editHostModal";
import { SpruceForm } from "components/SpruceForm";
import { useToastContext } from "context/toast";
import {
  EditSpawnHostMutation,
  EditSpawnHostMutationVariables,
} from "gql/generated/types";
import { EDIT_SPAWN_HOST } from "gql/mutations";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";
import { omit } from "utils/object";

interface EditSpawnHostModalProps {
  visible?: boolean;
  onCancel: () => void;
  host: MyHost;
}
export const EditSpawnHostModal: React.FC<EditSpawnHostModalProps> = ({
  host,
  onCancel,
  visible = true,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useSpawnAnalytics();

  const {
    disableExpirationCheckbox,
    instanceTypesData,
    noExpirationCheckboxTooltip,
    publicKeysData,
    volumesData,
  } = useLoadFormData(host);

  const instanceTypes = instanceTypesData?.instanceTypes ?? [];
  const volumes =
    volumesData?.myVolumes?.filter(
      (v) => v.availabilityZone === host.availabilityZone && v.hostID === "",
    ) ?? [];
  const userTags =
    host?.instanceTags
      ?.filter((tag) => tag.canBeModified)
      ?.map((tag) => ({ key: tag.key, value: tag.value })) ?? [];
  const publicKeys = publicKeysData?.myPublicKeys ?? [];

  const initialFormState = {
    hostName: host.displayName ?? "",
    expirationDetails: {
      expiration: host.expiration ? host.expiration.toString() : null,
      noExpiration: host.noExpiration,
    },
    instanceType: host.instanceType ?? "",
    volume: "",
    rdpPassword: "",
    userTags,
    publicKeySection: { useExisting: true, publicKeyNameDropdown: "" },
  };

  const [formState, setFormState] = useState<FormState>(initialFormState);

  const { schema, uiSchema } = getFormSchema({
    canEditInstanceType: host.status === HostStatus.Stopped,
    canEditRdpPassword:
      host.distro.isWindows && host.status === HostStatus.Running,
    canEditSshKeys: host.status === HostStatus.Running,
    disableExpirationCheckbox,
    instanceTypes: instanceTypes ?? [],
    myPublicKeys: publicKeys ?? [],
    noExpirationCheckboxTooltip,
    volumes,
  });

  // EDIT HOST MUTATION
  const [editSpawnHostMutation, { loading: loadingSpawnHost }] = useMutation<
    EditSpawnHostMutation,
    EditSpawnHostMutationVariables
  >(EDIT_SPAWN_HOST, {
    onCompleted(mutationResult) {
      const { id } = mutationResult?.editSpawnHost ?? {};
      dispatchToast.success(`Successfully modified spawned host: ${id}`);
      onCancel();
    },
    onError(err) {
      dispatchToast.error(
        `There was an error while modifying your host: ${err.message}`,
      );
      onCancel();
    },
    refetchQueries: ["MyVolumes"],
  });

  const initialEditState = formToGql({
    formData: initialFormState,
    hostId: host.id,
    myPublicKeys: publicKeys,
    oldUserTags: userTags,
  });

  const currEditState = formToGql({
    formData: formState,
    hostId: host.id,
    myPublicKeys: publicKeys,
    oldUserTags: userTags,
  });

  const [hasChanges, mutationParams] = computeDiff(
    initialEditState,
    currEditState,
  );

  const onSubmit = () => {
    sendEvent({
      name: "Edited a Spawn Host",
      params: {
        hostId: host.id,
        ...omit(mutationParams, ["publicKey"]),
      },
    });
    editSpawnHostMutation({
      variables: {
        hostId: host.id,
        ...mutationParams,
      },
    });
  };

  return (
    <ConfirmationModal
      title="Edit Host Details"
      open={visible}
      data-cy="edit-spawn-host-modal"
      submitDisabled={!hasChanges || loadingSpawnHost}
      onCancel={() => {
        onCancel();
        setFormState(initialFormState);
      }}
      onConfirm={onSubmit}
      buttonText={loadingSpawnHost ? "Saving" : "Save"}
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
