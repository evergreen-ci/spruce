import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useDistroSettingsAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm } from "components/SpruceForm";
import { getDistroSettingsRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  CreateDistroMutation,
  CreateDistroMutationVariables,
} from "gql/generated/types";
import { CREATE_DISTRO } from "gql/mutations";
import { modalFormDefinition } from "./newDistroSchema";

const { initialFormData, schema, uiSchema } = modalFormDefinition;

interface Props {
  handleClose: () => void;
  open: boolean;
}

export const CreateModal: React.FC<Props> = ({ handleClose, open }) => {
  const navigate = useNavigate();
  const dispatchToast = useToastContext();
  const { sendEvent } = useDistroSettingsAnalytics();

  const [formState, setFormState] = useState(initialFormData);
  const [hasError, setHasError] = useState(true);

  const [createDistro] = useMutation<
    CreateDistroMutation,
    CreateDistroMutationVariables
  >(CREATE_DISTRO, {
    onCompleted({ createDistro: { newDistroId } }) {
      navigate(getDistroSettingsRoute(newDistroId), { replace: true });
      dispatchToast.success(`Created distro “${newDistroId}”`);
    },
    onError(err) {
      dispatchToast.error(`Creating distro: ${err.message}`);
    },
  });

  const onConfirm = () => {
    createDistro({
      variables: {
        opts: {
          newDistroId: formState.newDistroId,
        },
      },
    });
    sendEvent({
      name: "Create new distro",
      newDistroId: formState.newDistroId,
    });
    handleClose();
  };

  return (
    <ConfirmationModal
      buttonText="Create"
      data-cy="create-distro-modal"
      onCancel={handleClose}
      onConfirm={onConfirm}
      open={open}
      submitDisabled={hasError}
      title="Create New Distro"
    >
      <SpruceForm
        formData={formState}
        onChange={({ errors, formData }) => {
          setHasError(errors.length > 0);
          setFormState(formData);
        }}
        schema={schema}
        uiSchema={uiSchema}
      />
    </ConfirmationModal>
  );
};
