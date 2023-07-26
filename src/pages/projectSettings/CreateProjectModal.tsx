import { useEffect, useState } from "react";
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
  GithubOrgsQuery,
} from "gql/generated/types";
import { CREATE_PROJECT } from "gql/mutations";
import { GET_GITHUB_ORGS } from "gql/queries";
import { projectId, projectName, requestS3Creds } from "./sharedFormSchema";

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
    projectId: "",
    projectName: "",
    repo: repo ?? "",
    requestS3Creds: false,
  });
  const [hasError, setHasError] = useState(true);

  const { data: gitOrgs } = useQuery<GithubOrgsQuery>(GET_GITHUB_ORGS, {
    skip: !open,
  });
  const { spruceConfig: { githubOrgs = [] } = {} } = gitOrgs ?? {};

  const form = modalFormDefinition(githubOrgs);

  const [createProject, { called, data, error, loading }] = useMutation<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >(CREATE_PROJECT, { errorPolicy: "all" });

  useEffect(() => {
    // onCompleted and onError don't provide sufficient information when used with errorPolicy: 'all', so use hook to manage behavior after confirming modal.
    // https://github.com/apollographql/apollo-client/issues/6966
    if (!called || loading) {
      return;
    }

    const identifier = data?.createProject?.identifier;
    if (identifier) {
      if (error) {
        dispatchToast.warning(
          `Project cannot be enabled due to the global or repo-specific limits.`,
          true,
          { shouldTimeout: false }
        );
      } else {
        dispatchToast.success(
          `Successfully created the project: ${identifier}`
        );
      }
      navigate(getProjectSettingsRoute(identifier), { replace: true });
    } else if (error) {
      dispatchToast.error(
        `There was an error creating the project: ${error?.message}`
      );
    }
  }, [
    called,
    data?.createProject?.identifier,
    error,
    loading,
    navigate,
    dispatchToast,
  ]);

  const onConfirm = () => {
    createProject({
      variables: {
        project: {
          identifier: formState.projectName,
          owner: formState.owner,
          repo: formState.repo,
          ...(formState?.projectId && { id: formState.projectId }),
        },
        requestS3Creds: formState.requestS3Creds,
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
          onChange={({ errors, formData }) => {
            setHasError(errors.length > 0);
            setFormState(formData);
          }}
          schema={form.schema}
          uiSchema={form.uiSchema}
        />
      ) : (
        <Skeleton paragraph={{ rows: 11 }} data-cy="loading-skeleton" />
      )}
    </ConfirmationModal>
  );
};

const modalFormDefinition = (githubOrgs: string[]) => ({
  schema: {
    properties: {
      owner: {
        oneOf: githubOrgs.map((org) => ({
          enum: [org],
          title: org,
          type: "string" as "string",
        })),
        title: "Owner",
        type: "string" as "string",
      },
      projectId: projectId.schema,
      projectName: projectName.schema,
      repo: {
        format: "noSpaces",
        minLength: 1,
        title: "Repo",
        type: "string" as "string",
      },
      requestS3Creds: requestS3Creds.schema,
    },
    required: ["owner", "repo"],
    type: "object" as "object",
  },
  uiSchema: {
    owner: {
      "ui:allowDeselect": false,
      "ui:data-cy": "new-owner-select",
    },
    projectId: projectId.uiSchema,
    projectName: projectName.uiSchema,
    repo: {
      "ui:data-cy": "new-repo-input",
    },
    requestS3Creds: requestS3Creds.uiSchema,
  },
});
