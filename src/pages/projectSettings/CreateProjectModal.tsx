import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { useProjectSettingsAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm } from "components/SpruceForm";
import { getProjectSettingsRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  CreateProjectMutation,
  CreateProjectMutationVariables,
  GetGithubOrgsQuery,
} from "gql/generated/types";
import { CREATE_PROJECT } from "gql/mutations";
import { GET_GITHUB_ORGS } from "gql/queries";
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
  const navigate = useNavigate();
  const { sendEvent } = useProjectSettingsAnalytics();

  const [formState, setFormState] = useState({
    owner: owner ?? "",
    repo: repo ?? "",
    projectName: "",
    projectId: "",
  });
  const [hasError, setHasError] = useState(true);

  const { data } = useQuery<GetGithubOrgsQuery>(GET_GITHUB_ORGS);
  const { spruceConfig: { githubOrgs = [] } = {} } = data ?? {};

  const form = modalFormDefinition(githubOrgs);

  const [createProject] = useMutation<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >(CREATE_PROJECT, {
    onCompleted({ createProject: { identifier } }) {
      dispatchToast.success(`Successfully created the project: ${identifier}`);
      navigate(getProjectSettingsRoute(identifier), { replace: true });
    },
    onError(err) {
      dispatchToast.error(
        `There was an error creating the project: ${err.message}`
      );
    },
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
    sendEvent({ name: "Create new project" });
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
      {githubOrgs.length ? (
        <SpruceForm
          formData={formState}
          onChange={({ formData, errors }) => {
            setHasError(errors.length > 0);
            setFormState(formData);
          }}
          schema={form.schema}
          uiSchema={form.uiSchema}
        />
      ) : (
        <Skeleton paragraph={{ rows: 11 }} />
      )}
    </ConfirmationModal>
  );
};

const modalFormDefinition = (githubOrgs: string[]) => ({
  schema: {
    type: "object" as "object",
    required: ["owner", "repo"],
    properties: {
      projectName: projectName.schema,
      projectId: projectId.schema,
      owner: {
        type: "string" as "string",
        title: "Owner",
        oneOf: githubOrgs.map((org) => ({
          type: "string" as "string",
          title: org,
          enum: [org],
        })),
      },
      repo: {
        type: "string" as "string",
        title: "Repo",
        minLength: 1,
        format: "noSpaces",
      },
    },
  },
  uiSchema: {
    projectName: projectName.uiSchema,
    projectId: projectId.uiSchema,
    owner: {
      "ui:data-cy": "owner-select",
      "ui:allowDeselect": false,
    },
    repo: {
      "ui:data-cy": "repo-input",
    },
  },
});
