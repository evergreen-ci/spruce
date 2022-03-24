import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
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
  GetUserPermissionsQuery,
} from "gql/generated/types";
import { CREATE_PROJECT } from "gql/mutations";
import { GET_USER_PERMISSIONS } from "gql/queries";

const getModalFormDefinition = (owner: string, repo: string) => ({
  schema: {
    type: "object" as "object",
    properties: {
      projectName: {
        type: "string" as "string",
        title: "Project Name",
        default: "",
        minLength: 1,
      },
      projectId: {
        type: "string" as "string",
        title: "Project ID",
      },
      owner: {
        type: "string" as "string",
        title: "Owner",
        default: owner,
        minLength: 1,
      },
      repo: {
        type: "string" as "string",
        title: "Repo",
        default: repo,
        minLength: 1,
      },
    },
    required: ["owner", "repo", "projectName"],
  },
  uiSchema: {
    projectName: {
      "ui:data-cy": "project-name-input",
      "ui:showErrors": false,
    },
    projectId: {
      "ui:data-cy": "project-id-input",
      "ui:optional": true,
      "ui:description":
        "The project ID would be used by Evergreen internally instead of defaulting to a random hash; An ID should only be user-specified with good reason, such as if the project will be using performance tooling. It cannot be changed!",
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

  // USER PERMISSIONS QUERY
  const { data: userPermissionsData } = useQuery<GetUserPermissionsQuery>(
    GET_USER_PERMISSIONS
  );
  const { user } = userPermissionsData || {};
  const { permissions } = user || {};
  const canCreateProject = permissions?.canCreateProject;

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

  const [createProject] = useMutation<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >(CREATE_PROJECT, {
    onCompleted(data) {
      dispatchToast.success(
        `Successfully created the project: ${JSON.stringify(
          data?.createProject.identifier
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

  if (!canCreateProject) {
    return null;
  }

  return (
    <Container>
      {canCreateProject && (
        <ButtonContainer>
          <Button
            onClick={() => setOpen(true)}
            size={Size.Small}
            data-cy="create-project-button"
            variant={Variant.Primary}
          >
            Create New Project
          </Button>
        </ButtonContainer>
      )}
      <ConfirmationModal
        buttonText="Create Project"
        data-cy="create-project-modal"
        onCancel={onCancel}
        onConfirm={() => onConfirm(formState)}
        open={open}
        submitDisabled={hasError}
        title="Create New Project"
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
`;

const ButtonContainer = styled.div`
  margin-top: ${size.xs};
`;
