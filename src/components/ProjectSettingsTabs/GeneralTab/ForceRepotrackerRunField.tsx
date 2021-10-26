import { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Button } from "components/Button";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm, SpruceFormProps } from "components/SpruceForm";
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

export const ForceRepotrackerRunModal: React.FC<ModalProps> = ({
  closeModal,
  open,
  projectId,
}) => {
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
        `There was an error creating the repotracker job: ${err.message}`
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

export const ForceRepotrackerRunField: React.FC<SpruceFormProps> = ({
  formData,
  onChange,
  schema,
  uiSchema,
}) => {
  const {
    options: { projectId },
  } = uiSchema;
  const [open, setOpen] = useState(false);

  const closeModal = () => setOpen(false);

  return (
    <Container>
      <SpruceForm
        formData={formData}
        onChange={({ formData: formUpdate }) => onChange(formUpdate)}
        schema={schema}
        tagName="fieldset"
        uiSchema={uiSchema}
      />
      <Button
        onClick={() => setOpen(true)}
        size="small"
        data-cy="force-repotracker-run-button"
      >
        Force Repotracker Run
      </Button>
      <ForceRepotrackerRunModal
        closeModal={closeModal}
        open={open}
        projectId={projectId}
      />
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: 20px;
`;
