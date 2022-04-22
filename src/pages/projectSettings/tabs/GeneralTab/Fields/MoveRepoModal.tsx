import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm } from "components/SpruceForm";
import { useToastContext } from "context/toast";
import {
  AttachProjectToNewRepoMutation,
  AttachProjectToNewRepoMutationVariables,
} from "gql/generated/types";
import { ATTACH_PROJECT_TO_NEW_REPO } from "gql/mutations";
import { string } from "utils";

const { joinWithConjunction } = string;

type ModalProps = {
  githubOrgs: string[];
  handleClose: () => void;
  open: boolean;
  projectId: string;
  repoName: string;
  repoOwner: string;
};

export const MoveRepoModal: React.VFC<ModalProps> = ({
  githubOrgs,
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
      <p>
        {/* TODO: Replace with LeafyGreen Select when z-index modal bug has been fixed (PD-1677) */}
        GitHub Organizations available for use as project owners are:{" "}
        {joinWithConjunction(githubOrgs, "and")}
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
