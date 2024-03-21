import { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Description } from "@leafygreen-ui/typography";
import { Field } from "@rjsf/core";
import { useParams } from "react-router-dom";
import { ConfirmationModal } from "components/ConfirmationModal";
import { slugs } from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
} from "gql/generated/types";
import { DELETE_PROJECT } from "gql/mutations";

interface ModalProps {
  closeModal: () => void;
  open: boolean;
  projectId: string;
}

const Modal: React.FC<ModalProps> = ({ closeModal, open, projectId }) => {
  const dispatchToast = useToastContext();
  const { [slugs.projectIdentifier]: identifier } = useParams();

  const [deleteProject, { loading }] = useMutation<
    DeleteProjectMutation,
    DeleteProjectMutationVariables
  >(DELETE_PROJECT, {
    onCompleted() {
      dispatchToast.success(
        `The project “${identifier}” was deleted. Future visits to this page will result in an error.`,
      );
    },
    onError(err) {
      dispatchToast.error(
        `There was an error deleting the project: ${err.message}`,
      );
    },
    refetchQueries: ["ViewableProjectRefs"],
  });

  const onConfirm = () => {
    deleteProject({ variables: { projectId } });
    closeModal();
  };

  return (
    <ConfirmationModal
      buttonText="Delete"
      variant="danger"
      onCancel={closeModal}
      onConfirm={onConfirm}
      open={open}
      submitDisabled={loading}
      title={`Delete “${identifier}”?`}
      data-cy="delete-project-modal"
    >
      <p>This action cannot be undone. Please proceed with caution.</p>
    </ConfirmationModal>
  );
};

export const DeleteProjectField: Field = ({ uiSchema }) => {
  const {
    options: { projectId },
  } = uiSchema;

  const [open, setOpen] = useState(false);

  return (
    <>
      <Modal
        closeModal={() => setOpen(false)}
        open={open}
        projectId={projectId}
      />
      <Description>
        Patches and tasks belonging to this project will continue to be viewable
        after deletion.
      </Description>
      <StyledButton
        onClick={() => setOpen(true)}
        data-cy="delete-project-button"
        variant="danger"
      >
        Delete project
      </StyledButton>
    </>
  );
};

const StyledButton = styled(Button)`
  margin-top: ${size.xs};
`;
