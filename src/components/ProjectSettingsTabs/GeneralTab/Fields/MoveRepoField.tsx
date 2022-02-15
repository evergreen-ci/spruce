import { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Field } from "@rjsf/core";
import { Button } from "components/Button";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm } from "components/SpruceForm";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  AttachProjectToRepoMutation,
  AttachProjectToRepoMutationVariables,
  DetachProjectFromRepoMutation,
  DetachProjectFromRepoMutationVariables,
} from "gql/generated/types";
import {
  ATTACH_PROJECT_TO_REPO,
  DETACH_PROJECT_FROM_REPO,
} from "gql/mutations";

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

export const AttachDetachModal: React.FC<{
  handleClose: () => void;
  open: boolean;
  projectId: string;
  repoName: string;
  repoOwner: string;
  shouldAttach: boolean;
}> = ({ handleClose, open, projectId, repoName, repoOwner, shouldAttach }) => {
  const dispatchToast = useToastContext();

  const [attachProjectToRepo] = useMutation<
    AttachProjectToRepoMutation,
    AttachProjectToRepoMutationVariables
  >(ATTACH_PROJECT_TO_REPO, {
    variables: { projectId },
    onCompleted() {
      dispatchToast.success("Successfully attached to repo");
    },
    onError(err) {
      dispatchToast.error(
        `There was an error attaching the project: ${err.message}`
      );
    },
    refetchQueries: ["ProjectSettings", "RepoSettings"],
  });

  const [detachProjectFromRepo] = useMutation<
    DetachProjectFromRepoMutation,
    DetachProjectFromRepoMutationVariables
  >(DETACH_PROJECT_FROM_REPO, {
    variables: { projectId },
    onCompleted() {
      dispatchToast.success("Successfully detached from repo");
    },
    onError(err) {
      dispatchToast.error(
        `There was an error detaching the project: ${err.message}`
      );
    },
    refetchQueries: ["ProjectSettings", "RepoSettings"],
  });

  return (
    <ConfirmationModal
      buttonText={shouldAttach ? "Attach" : "Detach"}
      data-cy="attach-repo-modal"
      onCancel={handleClose}
      onConfirm={() => {
        if (shouldAttach) {
          attachProjectToRepo();
        } else {
          detachProjectFromRepo();
        }
        handleClose();
      }}
      open={open}
      title={`Are you sure you want to ${
        shouldAttach ? "attach to" : "detach from"
      } ${repoOwner}/${repoName}?`}
      variant="danger"
    >
      {shouldAttach ? (
        <>
          Attaching to repo means that for each project setting, users will have
          the option of using the value defined at the repo level instead of
          setting it individually for this branch.
        </>
      ) : (
        <>
          Detaching means that this branch will no longer use defaults defined
          at the repo level. For any settings that are currently using the
          default, the current state will be saved to this branch, but
          repo-level settings will not be considered in the future.
        </>
      )}
    </ConfirmationModal>
  );
};

export const MoveRepoField: Field = ({
  formData,
  onChange,
  schema,
  uiSchema,
}) => {
  const {
    options: { projectId, repoName, repoOwner, useRepoSettings },
  } = uiSchema;
  const isRepo = useRepoSettings === undefined;
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [attachModalOpen, setAttachModalOpen] = useState(false);

  return (
    <Container hasButtons={!isRepo}>
      <SpruceForm
        formData={formData}
        onChange={({ formData: formUpdate }) => onChange(formUpdate)}
        schema={schema}
        tagName="fieldset"
        uiSchema={uiSchema}
      />
      {!isRepo && (
        <>
          <ButtonRow>
            {useRepoSettings && (
              <Button
                onClick={() => setMoveModalOpen(true)}
                size="small"
                data-cy="move-repo-button"
              >
                Move to New Repo
              </Button>
            )}
            <Button
              size="small"
              onClick={() => setAttachModalOpen(true)}
              data-cy="attach-repo-button"
            >
              {useRepoSettings
                ? "Detach from Current Repo"
                : "Attach to Current Repo"}
            </Button>
          </ButtonRow>
          {attachModalOpen && (
            <AttachDetachModal
              handleClose={() => setAttachModalOpen(false)}
              open={attachModalOpen}
              projectId={projectId}
              repoName={repoName || formData.repo}
              repoOwner={repoOwner || formData.owner}
              shouldAttach={!useRepoSettings}
            />
          )}
        </>
      )}
      <MoveRepoModal
        onCancel={() => setMoveModalOpen(false)}
        onConfirm={(formUpdate) => {
          setMoveModalOpen(false);
          onChange(formUpdate);
        }}
        open={moveModalOpen}
      />
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
    margin-right: ${size.xs};
  }
`;

const Container = styled.div`
  ${(props: { hasButtons: boolean }): string =>
    props.hasButtons && `margin-bottom: ${size.m};`}
`;
