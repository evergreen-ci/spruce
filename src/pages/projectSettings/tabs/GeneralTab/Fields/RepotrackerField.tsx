import { useState } from "react";
import { useMutation } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import { Field } from "@rjsf/core";
import { ConfirmationModal } from "components/ConfirmationModal";
import ElementWrapper from "components/SpruceForm/ElementWrapper";
import { useToastContext } from "context/toast";
import {
  ForceRepotrackerRunMutation,
  ForceRepotrackerRunMutationVariables,
} from "gql/generated/types";
import { FORCE_REPOTRACKER_RUN } from "gql/mutations";

interface ModalProps {
  closeModal: () => void;
  open: boolean;
  projectId: string;
}

const Modal: React.FC<ModalProps> = ({ closeModal, open, projectId }) => {
  const dispatchToast = useToastContext();

  const [forceRepotrackerRun, { loading }] = useMutation<
    ForceRepotrackerRunMutation,
    ForceRepotrackerRunMutationVariables
  >(FORCE_REPOTRACKER_RUN, {
    onCompleted() {
      dispatchToast.success("Created repotracker job.");
    },
    onError(err) {
      dispatchToast.error(
        `There was an error creating the repotracker job: ${err.message}`,
      );
    },
  });

  const runRepotracker = () => {
    forceRepotrackerRun({
      variables: {
        projectId,
      },
    });
  };

  const onConfirm = () => {
    runRepotracker();
    closeModal();
  };

  return (
    <ConfirmationModal
      buttonText="Confirm"
      onCancel={closeModal}
      onConfirm={onConfirm}
      open={open}
      submitDisabled={loading}
      title="Force Repotracker Run"
    >
      Are you sure you would like to force a Repotracker run?
    </ConfirmationModal>
  );
};

export const RepotrackerField: Field = ({ uiSchema }) => {
  const {
    options: { projectId },
  } = uiSchema;

  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <Modal
          closeModal={() => setOpen(false)}
          open={open}
          projectId={projectId}
        />
      )}
      <ElementWrapper>
        <Button
          onClick={() => setOpen(true)}
          size="small"
          data-cy="force-repotracker-run-button"
        >
          Force Repotracker Run
        </Button>
      </ElementWrapper>
    </>
  );
};
