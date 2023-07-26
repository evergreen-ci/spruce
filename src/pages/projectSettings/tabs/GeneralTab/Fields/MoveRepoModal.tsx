import { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { useProjectSettingsAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm } from "components/SpruceForm";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  AttachProjectToNewRepoMutation,
  AttachProjectToNewRepoMutationVariables,
} from "gql/generated/types";
import { ATTACH_PROJECT_TO_NEW_REPO } from "gql/mutations";

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
  const { sendEvent } = useProjectSettingsAnalytics();

  const form = moveRepoForm(githubOrgs);

  const [formState, setFormState] = useState(form.defaultFormData);
  const [hasError, setHasError] = useState(true);

  const [attachProjectToNewRepo] = useMutation<
    AttachProjectToNewRepoMutation,
    AttachProjectToNewRepoMutationVariables
  >(ATTACH_PROJECT_TO_NEW_REPO, {
    onCompleted(attachProjectMutation) {
      const { repoRefId } = attachProjectMutation?.attachProjectToNewRepo ?? {};
      dispatchToast.success(`Successfully attached to repo ${repoRefId}`);
    },
    onError(err) {
      dispatchToast.error(
        `There was an error attaching the project: ${err.message}`
      );
    },
    refetchQueries: [
      "ProjectSettings",
      "RepoSettings",
      "ViewableProjectRefs",
      "GithubProjectConflicts",
    ],
  });

  return (
    <ConfirmationModal
      buttonText="Move Project"
      data-cy="move-repo-modal"
      onCancel={handleClose}
      onConfirm={() => {
        const newOwner = formState.owner;
        const newRepo = formState.repo;
        attachProjectToNewRepo({
          variables: {
            project: {
              newOwner,
              newRepo,
              projectId,
            },
          },
        });
        sendEvent({
          name: "Move project to new repo",
          repoName: newRepo,
          repoOwner: newOwner,
        });
        handleClose();
      }}
      open={open}
      submitDisabled={hasError}
      title="Move to New Repo"
      variant="danger"
    >
      <StyledBody>
        Currently this project is using default settings for the repo{" "}
        {repoOwner}/{repoName}. Attach to an existing repo or create a new one
        to which unconfigured settings in this project will default.
      </StyledBody>
      <StyledBody>
        Any GitHub features that can only be enabled on one branch will be
        disabled on this branch if there is a conflict with existing branches.
      </StyledBody>
      <SpruceForm
        formData={formState}
        onChange={({ errors, formData }) => {
          setHasError(errors.length > 0);
          setFormState(formData);
        }}
        schema={form.schema}
        uiSchema={form.uiSchema}
      />
    </ConfirmationModal>
  );
};

const StyledBody = styled(Body)`
  margin-bottom: ${size.xs};
`;

const moveRepoForm = (githubOrgs: string[]) => ({
  defaultFormData: {
    owner: githubOrgs[0],
    repo: "",
  },
  schema: {
    properties: {
      owner: {
        oneOf: githubOrgs.map((org) => ({
          enum: [org],
          title: org,
          type: "string" as "string",
        })),
        title: "New Owner",
        type: "string" as "string",
      },
      repo: {
        format: "noSpaces",
        minLength: 1,
        title: "New Repository Name",
        type: "string" as "string",
      },
    },
    required: ["owner", "repo"],
    type: "object" as "object",
  },
  uiSchema: {
    owner: {
      "ui:allowDeselect": false,
      "ui:data-cy": "new-owner-select",
    },
    repo: {
      "ui:data-cy": "new-repo-input",
    },
  },
});
