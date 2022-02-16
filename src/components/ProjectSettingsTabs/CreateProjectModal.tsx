import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Size, Variant } from "@leafygreen-ui/button";
import { Button } from "components/Button";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm } from "components/SpruceForm";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  CreateProjectMutation,
  CreateProjectMutationVariables,
  ProjectSettingsFragment,
  RepoSettingsFragment,
} from "gql/generated/types";
import { CREATE_PROJECT } from "gql/mutations";

const getModalFormDefinition = (project: any) => ({
  schema: {
    type: "object" as "object",
    properties: {
      projectName: {
        type: "string" as "string",
        title: "Project Name",
      },
      projectId: {
        type: "string" as "string",
        title: "Project Id",
        value: "hi",
        description:
          "Optionally enter immutable project ID that would be used by Evergreen internally and defaults to a random hash; should only be user-specified with good reason, such as if the project will be using performance tooling. Cannot be changed!",
      },
      owner: {
        type: "string" as "string",
        title: "Owner",
        default: project?.projectRef?.owner,
      },
      repo: {
        type: "string" as "string",
        title: "Repo",
        default: project?.projectRef?.repo,
      },
    },
  },
  uiSchema: {
    projectName: {
      "ui:data-cy": "project-name-input",
    },
    projectId: {
      "ui:data-cy": "project-id-input",
      "ui:description":
        "Optionally enter an immutable project ID that would be used by Evergreen internally instead of defaulting to a random hash; An id should only be user-specified with good reason, such as if the project will be using performance tooling. \n It cannot be changed!",
    },
    owner: {
      "ui:data-cy": "new-owner-input",
    },
    repo: {
      "ui:data-cy": "new-repo-input",
    },
  },
});
interface Props {
  project: ProjectSettingsFragment | RepoSettingsFragment;
}
export const CreateProjectModal: React.FC<Props> = ({ project }) => {
  const modalFormDefinition = getModalFormDefinition(project);
  const isAdmin = true; // todo after EVG-16353
  const [open, setOpen] = useState(false);

  const onCancel = () => setOpen(false);
  const onConfirm = (formState) => {
    createProject({
      variables: {
        project: {
          identifier: formState.projectName,
          id: formState.projectId,
          owner: formState.owner,
          repo: formState.repo,
        },
      },
    });
    setOpen(false);
  };
  const [formState, setFormState] = useState({});
  const [hasError, setHasError] = useState(false);
  const isDisabled =
    Object.keys(formState).length === 0 ||
    Object.values(formState).some((input) => input === "") ||
    hasError;

  const dispatchToast = useToastContext();

  const [createProject] = useMutation<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >(CREATE_PROJECT, {
    onCompleted(data) {
      dispatchToast.success(
        `Successfully created the project: ${JSON.stringify(
          data?.createProject.id
        )}`
      );
    },
    onError(err) {
      dispatchToast.error(
        `There was an error creating the project: ${err.message}`
      );
    },
    refetchQueries: ["ProjectSettings", "RepoSettings"],
  });

  return (
    <Container>
      {isAdmin && (
        <Button
          onClick={() => setOpen(true)}
          size={Size.Small}
          data-cy="create-project-button"
          variant={Variant.Primary}
        >
          Create New Project
        </Button>
      )}
      <ConfirmationModal
        buttonText="Create Project"
        data-cy="create-project-modal"
        onCancel={onCancel}
        onConfirm={() => onConfirm(formState)}
        open={open}
        submitDisabled={isDisabled}
        title="Create New Project"
        variant="danger"
      >
        <Container>
          <SpruceForm
            formData={formState}
            onChange={({ formData, errors }) => {
              setHasError(errors.length > 0);
              setFormState(formData);
            }}
            schema={modalFormDefinition.schema}
            uiSchema={modalFormDefinition.uiSchema}
          />
        </Container>
      </ConfirmationModal>
    </Container>
  );
};

const Container = styled.div`
  display: inline;

  margin-left: ${size.s};
`;
