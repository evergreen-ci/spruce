import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import Banner from "@leafygreen-ui/banner";
import { useParams } from "react-router-dom";
import { SpruceForm } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  GithubProjectConflictsQuery,
  GithubProjectConflictsQueryVariables,
} from "gql/generated/types";
import { GET_GITHUB_PROJECT_CONFLICTS } from "gql/queries";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "pages/projectSettings/Context";
import { ProjectType } from "../utils";
import { ErrorType, getVersionControlError } from "./getErrors";
import { getFormSchema } from "./getFormSchema";
import { mergeProjectRepo } from "./transformers";
import { FormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.GithubCommitQueue;

const getInitialFormState = (
  projectData: FormState,
  repoData: FormState
): FormState => {
  if (!projectData) return repoData;
  if (repoData) {
    return mergeProjectRepo(projectData, repoData);
  }
  return projectData;
};

export const GithubCommitQueueTab: React.VFC<TabProps> = ({
  githubWebhooksEnabled,
  projectData,
  projectType,
  repoData,
  versionControlEnabled,
}) => {
  const { identifier } = useParams<{ identifier: string }>();
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData } = getTab(tab);

  const { data } = useQuery<
    GithubProjectConflictsQuery,
    GithubProjectConflictsQueryVariables
  >(GET_GITHUB_PROJECT_CONFLICTS, {
    skip: projectType === ProjectType.Repo,
    variables: { projectId: identifier },
  });

  const initialFormState = useMemo(
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData]
  );
  usePopulateForm(initialFormState, tab);

  const onChange = updateForm(tab);

  const { fields, schema, uiSchema } = useMemo(
    () =>
      getFormSchema(
        identifier,
        projectType,
        githubWebhooksEnabled,
        formData,
        data?.githubProjectConflicts,
        versionControlEnabled,
        projectType === ProjectType.AttachedProject ? repoData : null
      ),
    [
      data?.githubProjectConflicts,
      formData,
      githubWebhooksEnabled,
      identifier,
      projectType,
      repoData,
      versionControlEnabled,
    ]
  );

  if (!formData) return null;

  const validateConflicts = validate(
    projectType,
    repoData,
    versionControlEnabled
  );

  return (
    <>
      {!githubWebhooksEnabled && (
        <Banner data-cy="disabled-webhook-banner" variant="warning">
          GitHub features are disabled because webhooks are not enabled.
          Webhooks are enabled after saving with a repository and branch.
        </Banner>
      )}
      <SpruceForm
        fields={fields}
        formData={formData}
        onChange={onChange}
        schema={schema}
        uiSchema={uiSchema}
        disabled={!githubWebhooksEnabled}
        validate={validateConflicts}
      />
    </>
  );
};

const validate = (projectType, repoData, versionControlEnabled) => (
  formData,
  errors
) => {
  const {
    github: {
      prTestingEnabled,
      prTesting,
      githubChecksEnabled,
      githubChecks,
      gitTagVersionsEnabled,
      gitTags,
    },
    commitQueue: { enabled, patchDefinitions },
  } = formData;

  // getVersionControlError is a curried function, so save its partial application here to avoid repetition
  const getAliasError = getVersionControlError(
    versionControlEnabled,
    projectType
  );

  if (
    getAliasError(
      prTestingEnabled,
      prTesting?.githubPrAliasesOverride,
      prTesting?.githubPrAliases,
      repoData?.github?.prTesting?.githubPrAliases
    ) === ErrorType.Error
  ) {
    errors.github.prTesting.addError("Missing Patch Definition");
  }

  if (
    getAliasError(
      githubChecksEnabled,
      githubChecks?.githubCheckAliasesOverride,
      githubChecks?.githubCheckAliases,
      repoData?.github?.githubChecks?.githubCheckAliases
    ) === ErrorType.Error
  ) {
    errors.github.prTesting.addError("Missing Commit Check Definition");
  }

  if (
    getAliasError(
      gitTagVersionsEnabled,
      gitTags?.gitTagAliasesOverride,
      gitTags?.gitTagAliases,
      repoData?.github?.gitTags?.gitTagAliases
    ) === ErrorType.Error
  ) {
    errors.github.prTesting.addError("Missing Git Tag Definition");
  }

  if (
    getAliasError(
      enabled,
      patchDefinitions?.commitQueueAliasesOverride,
      patchDefinitions?.commitQueueAliases,
      repoData?.commitQueue?.patchDefinitions?.commitQueueAliases
    ) === ErrorType.Error
  ) {
    errors.github.prTesting.addError("Missing Commit Queue Patch Definition");
  }

  return errors;
};
