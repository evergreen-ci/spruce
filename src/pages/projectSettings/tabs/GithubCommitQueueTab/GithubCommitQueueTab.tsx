import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import Banner from "@leafygreen-ui/banner";
import { ValidateProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  GithubProjectConflictsQuery,
  GithubProjectConflictsQueryVariables,
} from "gql/generated/types";
import { GITHUB_PROJECT_CONFLICTS } from "gql/queries";
import { useProjectSettingsContext } from "pages/projectSettings/Context";
import { BaseTab } from "../BaseTab";
import { ProjectType } from "../utils";
import { ErrorType, getVersionControlError } from "./getErrors";
import { getFormSchema } from "./getFormSchema";
import { mergeProjectRepo } from "./transformers";
import { GCQFormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.GithubCommitQueue;

const getInitialFormState = (
  projectData: GCQFormState,
  repoData: GCQFormState,
): GCQFormState => {
  if (!projectData) return repoData;
  if (repoData) {
    return mergeProjectRepo(projectData, repoData);
  }
  return projectData;
};

export const GithubCommitQueueTab: React.FC<TabProps> = ({
  githubWebhooksEnabled,
  identifier,
  projectData,
  projectId,
  projectType,
  repoData,
  versionControlEnabled,
}) => {
  const { getTab } = useProjectSettingsContext();
  // @ts-expect-error - see TabState for details.
  const { formData }: { formData: GCQFormState } = getTab(tab);

  const { data } = useQuery<
    GithubProjectConflictsQuery,
    GithubProjectConflictsQueryVariables
  >(GITHUB_PROJECT_CONFLICTS, {
    skip: projectType === ProjectType.Repo,
    variables: { projectId },
  });

  const initialFormState = useMemo(
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData],
  );

  const formSchema = useMemo(
    () =>
      getFormSchema(
        identifier,
        projectType,
        githubWebhooksEnabled,
        formData,
        data?.githubProjectConflicts,
        versionControlEnabled,
        projectType === ProjectType.AttachedProject ? repoData : null,
      ),
    [
      data?.githubProjectConflicts,
      formData,
      githubWebhooksEnabled,
      identifier,
      projectType,
      repoData,
      versionControlEnabled,
    ],
  );

  const validateConflicts = validate(
    projectType,
    repoData,
    versionControlEnabled,
  );

  return (
    <>
      {!githubWebhooksEnabled && (
        <Banner data-cy="disabled-webhook-banner" variant="warning">
          GitHub features are disabled because the Evergreen GitHub App is not
          installed on the saved owner/repo. Contact IT to install the App and
          enable GitHub features.
        </Banner>
      )}
      <BaseTab
        disabled={!githubWebhooksEnabled}
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={tab}
        validate={validateConflicts}
      />
    </>
  );
};

const validate = (
  projectType: ProjectType,
  repoData: GCQFormState,
  versionControlEnabled: boolean,
) =>
  ((formData, errors) => {
    const {
      commitQueue: { enabled, patchDefinitions },
      github: {
        gitTagVersionsEnabled,
        gitTags,
        githubChecks,
        githubChecksEnabled,
        prTesting,
        prTestingEnabled,
      },
    } = formData;

    // getVersionControlError is a curried function, so save its partial application here to avoid repetition
    const getAliasError = getVersionControlError(
      versionControlEnabled,
      projectType,
    );

    if (
      getAliasError(
        prTestingEnabled,
        prTesting?.githubPrAliasesOverride,
        prTesting?.githubPrAliases,
        repoData?.github?.prTesting?.githubPrAliases,
      ) === ErrorType.Error
    ) {
      errors.github.prTesting.addError("Missing Patch Definition");
    }

    if (
      getAliasError(
        githubChecksEnabled,
        githubChecks?.githubCheckAliasesOverride,
        githubChecks?.githubCheckAliases,
        repoData?.github?.githubChecks?.githubCheckAliases,
      ) === ErrorType.Error
    ) {
      errors.github.prTesting.addError("Missing Commit Check Definition");
    }

    if (
      getAliasError(
        gitTagVersionsEnabled,
        gitTags?.gitTagAliasesOverride,
        gitTags?.gitTagAliases,
        repoData?.github?.gitTags?.gitTagAliases,
      ) === ErrorType.Error
    ) {
      errors.github.prTesting.addError("Missing Git Tag Definition");
    }

    if (
      getAliasError(
        enabled,
        patchDefinitions?.commitQueueAliasesOverride,
        patchDefinitions?.commitQueueAliases,
        repoData?.commitQueue?.patchDefinitions?.commitQueueAliases,
      ) === ErrorType.Error
    ) {
      errors.github.prTesting.addError("Missing Commit Queue Patch Definition");
    }

    return errors;
  }) satisfies ValidateProps<GCQFormState>;
