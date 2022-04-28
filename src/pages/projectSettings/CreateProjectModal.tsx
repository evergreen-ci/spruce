import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm } from "components/SpruceForm";
import { getProjectSettingsRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  CreateProjectMutation,
  CreateProjectMutationVariables,
} from "gql/generated/types";
import { CREATE_PROJECT } from "gql/mutations";
import { projectId, projectName } from "./sharedFormSchema";

interface Props {
  handleClose: () => void;
  open: boolean;
  owner: string;
  repo: string;
}

export const CreateProjectModal: React.VFC<Props> = ({
  handleClose,
  open,
  owner,
  repo,
}) => {
  const dispatchToast = useToastContext();
  const { replace } = useHistory();

  const [formState, setFormState] = useState({
    owner: owner ?? "",
    repo: repo ?? "",
    projectName: "",
    projectId: "",
  });
  const [hasError, setHasError] = useState(true);

  const [createProject] = useMutation<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >(CREATE_PROJECT, {
    onCompleted({ createProject: { identifier } }) {
      dispatchToast.success(`Successfully created the project: ${identifier}`);
      replace(getProjectSettingsRoute(identifier));
    },
    onError(err) {
      dispatchToast.error(
        `There was an error creating the project: ${err.message}`
      );
    },
    refetchQueries: ["ProjectSettings", "RepoSettings"],
  });

  const onConfirm = () => {
    createProject({
      variables: {
        project: {
          identifier: formState.projectName,
          owner: formState.owner,
          repo: formState.repo,
          ...(formState?.projectId && { id: formState.projectId }),
        },
      },
    });
    handleClose();
  };

  return (
    <ConfirmationModal
      buttonText="Create Project"
      data-cy="create-project-modal"
      onCancel={handleClose}
      onConfirm={onConfirm}
      open={open}
      submitDisabled={hasError}
      title="Create New Project"
    >
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

const modalFormDefinition = {
  schema: {
    type: "object" as "object",
    properties: {
      projectName: projectName.schema,
      projectId: projectId.schema,
      owner: {
        type: "string" as "string",
        title: "Owner",
        minLength: 1,
      },
      repo: {
        type: "string" as "string",
        title: "Repo",
        minLength: 1,
      },
    },
  },
  uiSchema: {
    projectName: projectName.uiSchema,
    projectId: projectId.uiSchema,
    owner: {
      "ui:data-cy": "owner-input",
    },
    repo: {
      "ui:data-cy": "repo-input",
    },
  },
};
