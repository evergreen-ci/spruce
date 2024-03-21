import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useDistroSettingsAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm } from "components/SpruceForm";
import { getDistroSettingsRoute, slugs } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  CopyDistroMutation,
  CopyDistroMutationVariables,
} from "gql/generated/types";
import { COPY_DISTRO } from "gql/mutations";
import { modalFormDefinition } from "./newDistroSchema";

const { initialFormData, schema, uiSchema } = modalFormDefinition;

interface Props {
  handleClose: () => void;
  open: boolean;
}

export const CopyModal: React.FC<Props> = ({ handleClose, open }) => {
  const { [slugs.distroId]: distroId } = useParams();
  const navigate = useNavigate();
  const dispatchToast = useToastContext();
  const { sendEvent } = useDistroSettingsAnalytics();

  const [formState, setFormState] = useState(initialFormData);
  const [hasError, setHasError] = useState(true);

  const [copyDistro] = useMutation<
    CopyDistroMutation,
    CopyDistroMutationVariables
  >(COPY_DISTRO, {
    onCompleted({ copyDistro: { newDistroId } }) {
      navigate(getDistroSettingsRoute(newDistroId), { replace: true });
      dispatchToast.success(`Created distro “${newDistroId}”`);
    },
    onError(err) {
      dispatchToast.error(`Duplicating distro: ${err.message}`);
    },
  });

  const onConfirm = () => {
    copyDistro({
      variables: {
        opts: {
          distroIdToCopy: distroId,
          newDistroId: formState.newDistroId,
        },
      },
    });
    sendEvent({ name: "Duplicate distro", newDistroId: formState.newDistroId });
    handleClose();
  };

  return (
    <ConfirmationModal
      buttonText="Duplicate"
      data-cy="copy-distro-modal"
      onCancel={handleClose}
      onConfirm={onConfirm}
      open={open}
      submitDisabled={hasError}
      title={`Duplicate “${distroId}”`}
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
