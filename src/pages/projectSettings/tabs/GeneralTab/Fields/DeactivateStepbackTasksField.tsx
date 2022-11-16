import { useState } from "react";
import { useMutation } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import { Description, Label } from "@leafygreen-ui/typography";
import { Field } from "@rjsf/core";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm } from "components/SpruceForm";
import ElementWrapper from "components/SpruceForm/ElementWrapper";
import { useToastContext } from "context/toast";
import {
  DeactivateStepbackTaskMutation,
  DeactivateStepbackTaskMutationVariables,
} from "gql/generated/types";
import { DEACTIVATE_STEPBACK_TASK } from "gql/mutations";

interface ModalProps {
  closeModal: () => void;
  open: boolean;
  projectId: string;
}

const Modal: React.VFC<ModalProps> = ({ closeModal, open, projectId }) => {
  const dispatchToast = useToastContext();
  const [formState, setFormState] = useState(
    deactivateStepbackForm.defaultFormData
  );
  const [hasError, setHasError] = useState(true);

  const [deactivateStepbackTasks, { loading }] = useMutation<
    DeactivateStepbackTaskMutation,
    DeactivateStepbackTaskMutationVariables
  >(DEACTIVATE_STEPBACK_TASK, {
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
    const { buildVariantName, taskName } = formState;
    deactivateStepbackTasks({
      variables: {
        projectId,
        buildVariantName,
        taskName,
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
      submitDisabled={hasError || loading}
      title="Deactivate Scheduled Stepback Tasks"
      data-cy="deactivate-stepback-modal"
    >
      <p>
        Specify the build variant and task for which you want to deactivate the
        stepback process.
      </p>
      <SpruceForm
        formData={formState}
        onChange={({ formData, errors }) => {
          setHasError(errors.length > 0);
          setFormState(formData);
        }}
        schema={deactivateStepbackForm.schema}
        uiSchema={deactivateStepbackForm.uiSchema}
      />
    </ConfirmationModal>
  );
};

export const DeactivateStepbackTasksField: Field = ({ uiSchema }) => {
  const {
    options: { projectId },
  } = uiSchema;

  const [open, setOpen] = useState(false);
  const id = "deactivate-stepback-button";

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
          This will not turn off future stepbacks for the project.
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

const deactivateStepbackForm = {
  defaultFormData: {
    buildVariantName: "",
    taskName: "",
  },
  schema: {
    type: "object" as "object",
    required: ["buildVariantName", "taskName"],
    properties: {
      buildVariantName: {
        type: "string" as "string",
        title: "Build Variant Name",
        minLength: 1,
        format: "noSpaces",
      },
      taskName: {
        type: "string" as "string",
        title: "Task Name",
        minLength: 1,
        format: "noSpaces",
      },
    },
  },
  uiSchema: {
    buildVariantName: {
      "ui:data-cy": "deactivate-variant-name-input",
    },
    taskName: {
      "ui:data-cy": "deactivate-task-name-input",
    },
  },
};
