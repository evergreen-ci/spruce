import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Size, Variant } from "@leafygreen-ui/button";
import { Button } from "components/Button";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm, SpruceFormProps } from "components/SpruceForm";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  CreateProjectMutation,
  CreateProjectMutationVariables,
} from "gql/generated/types";
import { CREATE_PROJECT } from "gql/mutations";

const getModalFormDefinition = (owner: string, repo: string) => ({
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
      },
      owner: {
        type: "string" as "string",
        title: "Owner",
        default: owner,
      },
      repo: {
        type: "string" as "string",
        title: "Repo",
        default: repo,
      },
    },
  },
  uiSchema: {
    projectName: {
      "ui:data-cy": "project-name-input",
      "ui:showErrors": false,
    },
    projectId: {
      "ui:data-cy": "project-id-input",
      "ui:description":
        "Optionally enter an immutable project ID that would be used by Evergreen internally instead of defaulting to a random hash; An id should only be user-specified with good reason, such as if the project will be using performance tooling. \n It cannot be changed!",
    },
    owner: {
      "ui:data-cy": "owner-input",
      "ui:showErrors": false,
    },
    repo: {
      "ui:data-cy": "repo-input",
      "ui:showErrors": false,
    },
  },
});
interface Props {
  owner: string;
  repo: string;
}
export const CreateProjectModal: React.FC<Props> = ({ owner, repo }) => {
  const dispatchToast = useToastContext();
  const modalFormDefinition = getModalFormDefinition(owner, repo);
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
            validate={validate}
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

interface FormState {
  projectName: string;
  projectId: string;
  owner: string;
  repo: string;
}

const validate = (
  formData: FormState,
  errors
): ReturnType<SpruceFormProps["validate"]> => {
  const { projectName, owner, repo } = formData;

  if (projectName === "" || projectName === undefined) {
    errors.projectName.addError("Project name is required.");
  }

  if (owner === "" || owner === undefined) {
    errors.owner.addError("Owner is required.");
  }
  if (repo === "" || repo === undefined) {
    errors.repo.addError("Repo is required.");
  }
  return errors;
};
