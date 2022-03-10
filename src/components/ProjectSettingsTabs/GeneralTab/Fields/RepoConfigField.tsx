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
  AttachProjectToNewRepoMutation,
  AttachProjectToNewRepoMutationVariables,
  AttachProjectToRepoMutation,
  AttachProjectToRepoMutationVariables,
  DetachProjectFromRepoMutation,
  DetachProjectFromRepoMutationVariables,
} from "gql/generated/types";
import {
  ATTACH_PROJECT_TO_NEW_REPO,
  ATTACH_PROJECT_TO_REPO,
  DETACH_PROJECT_FROM_REPO,
} from "gql/mutations";
import { ProjectType } from "../../utils";

interface ModalProps {
  handleClose: () => void;
  open: boolean;
  projectId: string;
  repoName: string;
  repoOwner: string;
}

export const MoveRepoModal: React.FC<ModalProps> = ({
  handleClose,
  open,
  projectId,
  repoName,
  repoOwner,
}) => {
  const dispatchToast = useToastContext();

  const [formState, setFormState] = useState(moveRepoForm.defaultFormData);
  const [hasError, setHasError] = useState(true);

  const [attachProjectToNewRepo] = useMutation<
    AttachProjectToNewRepoMutation,
    AttachProjectToNewRepoMutationVariables
  >(ATTACH_PROJECT_TO_NEW_REPO, {
    onCompleted(attachProjectMutation) {
      const { repoRefId } = attachProjectMutation?.attachProjectToNewRepo;
      dispatchToast.success(`Successfully attached to repo ${repoRefId}`);
    },
    onError(err) {
      dispatchToast.error(
        `There was an error attaching the project: ${err.message}`
      );
    },
    refetchQueries: ["ProjectSettings", "RepoSettings"],
  });

  return (
    <ConfirmationModal
      buttonText="Move Project"
      data-cy="move-repo-modal"
      onCancel={handleClose}
      onConfirm={() => {
        attachProjectToNewRepo({
          variables: {
            project: {
              projectId,
              newOwner: formState.owner,
              newRepo: formState.repo,
            },
          },
        });
        handleClose();
      }}
      open={open}
      submitDisabled={hasError}
      title="Move to New Repo"
      variant="danger"
    >
      <p>
        Currently this project is using default settings for the repo{" "}
        {repoOwner}/{repoName}. Attach to an existing repo or create a new one
        to which unconfigured settings in this project will default.
      </p>
      <SpruceForm
        formData={formState}
        onChange={({ formData, errors }) => {
          setHasError(errors.length > 0);
          setFormState(formData);
        }}
        schema={moveRepoForm.schema}
        uiSchema={moveRepoForm.uiSchema}
      />
    </ConfirmationModal>
  );
};

export const AttachDetachModal: React.FC<
  ModalProps & {
    shouldAttach: boolean;
  }
> = ({ handleClose, open, projectId, repoName, repoOwner, shouldAttach }) => {
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

export const RepoConfigField: Field = ({
  formData,
  onChange,
  schema,
  uiSchema,
}) => {
  const {
    options: { projectId, projectType, repoName, repoOwner },
  } = uiSchema;
  const isRepo = projectType === ProjectType.Repo;
  const isAttachedProject = projectType === ProjectType.AttachedProject;
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
            {isAttachedProject && (
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
              {isAttachedProject
                ? "Detach from Current Repo"
                : "Attach to Current Repo"}
            </Button>
          </ButtonRow>
          <AttachDetachModal
            handleClose={() => setAttachModalOpen(false)}
            open={attachModalOpen}
            projectId={projectId}
            repoName={repoName || formData.repo}
            repoOwner={repoOwner || formData.owner}
            shouldAttach={!isAttachedProject}
          />
          <MoveRepoModal
            handleClose={() => setMoveModalOpen(false)}
            open={moveModalOpen}
            projectId={projectId}
            repoName={repoName}
            repoOwner={repoOwner}
          />
        </>
      )}
    </Container>
  );
};

const moveRepoForm = {
  defaultFormData: {
    owner: "",
    repo: "",
  },
  schema: {
    type: "object" as "object",
    properties: {
      owner: {
        type: "string" as "string",
        title: "New Owner",
        minLength: 1,
      },
      repo: {
        type: "string" as "string",
        title: "New Repository Name",
        minLength: 1,
      },
    },
    required: ["owner", "repo"],
  },
  uiSchema: {
    owner: {
      "ui:data-cy": "new-owner-input",
      "ui:showErrors": false,
    },
    repo: {
      "ui:data-cy": "new-repo-input",
      "ui:showErrors": false,
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
