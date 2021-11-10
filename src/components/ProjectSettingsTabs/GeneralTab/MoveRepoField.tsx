import { useState } from "react";
import styled from "@emotion/styled";
import { Button } from "components/Button";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm, SpruceFormProps } from "components/SpruceForm";

interface ModalProps {
  onCancel: () => void;
  onConfirm: (formUpdate: any) => void;
  open: boolean;
}

export const MoveRepoModal: React.FC<ModalProps> = ({
  onCancel,
  onConfirm,
  open,
}) => {
  const [formState, setFormState] = useState({});
  const [hasError, setHasError] = useState(false);
  const isDisabled =
    Object.keys(formState).length === 0 ||
    Object.values(formState).some((input) => input === "") ||
    hasError;

  return (
    <ConfirmationModal
      buttonText="Move Repo"
      data-cy="move-repo-modal"
      onCancel={onCancel}
      onConfirm={() => onConfirm(formState)}
      open={open}
      submitDisabled={isDisabled}
      title="Move Repo"
      variant="danger"
    >
      Select an existing repository or add a new one.
      {/* TODO: Add select component upon completion of EVG-15037 */}
      <SpruceForm
        formData={formState}
        onChange={({ formData, errors }) => {
          setHasError(errors.length > 0);
          setFormState(formData);
        }}
        schema={modalFormDefinition.schema}
        uiSchema={modalFormDefinition.uiSchema}
      />
    </ConfirmationModal>
  );
};

export const MoveRepoField: React.FC<SpruceFormProps> = ({
  formData,
  onChange,
  schema,
  uiSchema,
}) => {
  const {
    options: { useRepoSettings },
  } = uiSchema;
  const [open, setOpen] = useState(false);

  const onCancel = () => setOpen(false);
  const onConfirm = (formUpdate) => {
    setOpen(false);
    onChange(formUpdate);
  };

  return (
    <Container>
      <SpruceForm
        formData={formData}
        onChange={() => {}}
        schema={schema}
        tagName="fieldset"
        uiSchema={uiSchema}
      />
      <ButtonRow>
        <Button
          onClick={() => setOpen(true)}
          size="small"
          data-cy="move-repo-button"
        >
          Move to new repo
        </Button>
        <Button size="small">
          {useRepoSettings
            ? "Detach from current repo"
            : "Attach to current repo"}
        </Button>
      </ButtonRow>
      <MoveRepoModal onCancel={onCancel} onConfirm={onConfirm} open={open} />
    </Container>
  );
};

const modalFormDefinition = {
  schema: {
    type: "object" as "object",
    properties: {
      owner: {
        type: "string" as "string",
        title: "New Owner",
      },
      repo: {
        type: "string" as "string",
        title: "New Repository",
      },
    },
    dependencies: {
      owner: ["repo"],
      repo: ["owner"],
    },
  },
  uiSchema: {
    owner: {
      "ui:data-cy": "new-owner-input",
    },
    repo: {
      "ui:data-cy": "new-repo-input",
    },
  },
};

const ButtonRow = styled.div`
  display: inline;

  > :not(:last-child) {
    margin-right: 8px;
  }
`;

const Container = styled.div`
  margin-bottom: 20px;
`;
