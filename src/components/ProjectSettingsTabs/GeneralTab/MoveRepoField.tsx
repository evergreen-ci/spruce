import { useState } from "react";
import styled from "@emotion/styled";
import { Button } from "components/Button";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm, SpruceFormProps } from "components/SpruceForm";

const Modal: React.FC<any> = ({
  initialOwner,
  initialRepo,
  onCancel,
  onConfirm,
  open,
}) => {
  const [formState, setFormState] = useState({
    owner: initialOwner,
    repo: initialRepo,
  });

  const [hasError, setHasError] = useState(false);

  return (
    <ConfirmationModal
      buttonText="Move Repo"
      onCancel={onCancel}
      onConfirm={() => onConfirm(formState)}
      open={open}
      submitDisabled={hasError}
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
  const onConfirm = ({ newOwner, newRepo }) => {
    setOpen(false);
    onChange({ owner: newOwner, repo: newRepo });
  };

  return (
    <Container>
      <Modal
        initialOwner={formData?.owner}
        initialRepo={formData?.repo}
        onCancel={onCancel}
        onConfirm={onConfirm}
        open={open}
      />
      <SpruceForm
        formData={formData}
        onChange={() => {}}
        schema={schema}
        uiSchema={uiSchema}
        tagName="fieldset"
      />
      <ButtonRow>
        <Button onClick={() => setOpen(true)} size="small">
          Move to new repo
        </Button>
        <Button size="small">
          {useRepoSettings
            ? "Attach to current repo"
            : "Detach from current repo"}
        </Button>
      </ButtonRow>
    </Container>
  );
};

const modalFormDefinition = {
  schema: {
    type: "object" as "object",
    properties: {
      newOwner: {
        type: "string" as "string",
        title: "New Owner",
      },
      newRepo: {
        type: "string" as "string",
        title: "New Repository",
        id: "new-repo",
      },
    },
    dependencies: {
      newOwner: ["newRepo"],
      newRepo: ["newOwner"],
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
