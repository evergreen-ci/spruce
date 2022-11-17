import { useState } from "react";
import { useMutation } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import { Description, Label } from "@leafygreen-ui/typography";
import { Field } from "@rjsf/core";
import { ConfirmationModal } from "components/ConfirmationModal";
import ElementWrapper from "components/SpruceForm/ElementWrapper";
import { useToastContext } from "context/toast";
import {
  DeactivateStepbackTasksMutation,
  DeactivateStepbackTasksMutationVariables,
} from "gql/generated/types";
import { DEACTIVATE_STEPBACK_TASKS } from "gql/mutations";

interface ModalProps {
  closeModal: () => void;
  open: boolean;
  projectId: string;
}

const Modal: React.VFC<ModalProps> = ({ closeModal, open, projectId }) => {
  const dispatchToast = useToastContext();

  const [deactivateStepbackTasks, { loading }] = useMutation<
    DeactivateStepbackTasksMutation,
    DeactivateStepbackTasksMutationVariables
  >(DEACTIVATE_STEPBACK_TASKS, {
    onCompleted() {
      dispatchToast.success("Stepback tasks deactivated.");
    },
    onError(err) {
      dispatchToast.error(
        `There was an error deactivating stepback tasks: ${err.message}`
      );
    },
  });

  const onConfirm = () => {
    deactivateStepbackTasks({
      variables: {
        projectId,
      },
    });
    closeModal();
  };

  return (
    <ConfirmationModal
      buttonText="Confirm"
      onCancel={closeModal}
      onConfirm={onConfirm}
      open={open}
      submitDisabled={loading}
      title="Deactivate Scheduled Stepback Tasks"
    >
      Are you sure you would like to deactivate currently scheduled stepback
      tasks?
    </ConfirmationModal>
  );
};

export const DeactivateStepbackTasksField: Field = ({ uiSchema }) => {
  const {
    options: { projectId },
  } = uiSchema;

  const [open, setOpen] = useState(false);
  const id = "deactivate-stepback-tasks-button";

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
        <Label htmlFor={id}>
          Deactivate Currently Scheduled Stepback Tasks
        </Label>
        <Description>
          Deactivate a specific stepback task. This will not turn off future
          stepbacks for the task.
        </Description>
        <div>
          <Button
            id={id}
            onClick={() => setOpen(true)}
            size="small"
            data-cy={id}
          >
            Deactivate
          </Button>
        </div>
      </ElementWrapper>
    </>
  );
};
