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
import { GITHUB_ORGS } from "gql/queries";
import {
  PerformanceToolingBanner,
  enablePerformanceTooling,
  projectName,
  requestS3Creds,
} from "./CreateDuplicateSchema";

interface Props {
  handleClose: () => void;
  open: boolean;
  owner: string;
  repo: string;
}

export const CreateProjectModal: React.FC<Props> = ({
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
    enablePerformanceTooling: false,
    requestS3Creds: false,
  });
  const [hasError, setHasError] = useState(true);

  const { data: gitOrgs } = useQuery<GithubOrgsQuery>(GITHUB_ORGS, {
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
          { shouldTimeout: false },
        );
      } else {
        dispatchToast.success(
          `Successfully created the project: ${identifier}`,
        );
      }
      navigate(getProjectSettingsRoute(identifier), { replace: true });
    } else if (error) {
      dispatchToast.error(
        `There was an error creating the project: ${error?.message}`,
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
          ...(formState.enablePerformanceTooling && {
            id: formState.projectName,
          }),
        },
        requestS3Creds: formState.requestS3Creds,
      },
    });
    sendEvent({ name: "Create new project" });
    handleClose();
  };

  return (
    <ConfirmationModal
      buttonText="Create project"
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
    type: "object" as "object",
    required: ["owner", "repo"],
    properties: {
      projectName: projectName.schema,
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
      enablePerformanceTooling: enablePerformanceTooling.schema,
      performanceToolingBanner: {
        type: "null" as "null",
      },
      requestS3Creds: requestS3Creds.schema,
    },
  },
  uiSchema: {
    projectName: projectName.uiSchema,
    owner: {
      "ui:data-cy": "new-owner-select",
      "ui:allowDeselect": false,
    },
    repo: {
      "ui:data-cy": "new-repo-input",
    },
    enablePerformanceTooling: enablePerformanceTooling.uiSchema,
    performanceToolingBanner: {
      "ui:field": PerformanceToolingBanner,
      "ui:showLabel": false,
    },
    requestS3Creds: requestS3Creds.uiSchema,
  },
});
