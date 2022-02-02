import { useMemo } from "react";
import Banner from "@leafygreen-ui/banner";
import { SpruceForm, SpruceFormProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { environmentalVariables } from "utils";
import { usePopulateForm, useProjectSettingsContext } from "../Context";
import { getFormSchema } from "./getFormSchema";
import { mergeProjectRepo } from "./transformers";
import { AliasType, FormState, TabProps } from "./types";

const { isProduction } = environmentalVariables;

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

export const GithubCommitQueueTab: React.FC<TabProps> = ({
  gitHubWebhooksEnabled,
  projectData,
  repoData,
  useRepoSettings,
}) => {
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData } = getTab(tab);

  const initialFormState = useMemo(
    () => getInitialFormState(projectData, repoData),
    [projectData, repoData]
  );
  usePopulateForm(initialFormState, tab);

  const onChange = updateForm(tab);

  const { fields, schema, uiSchema } = useMemo(
    () =>
      getFormSchema(
        useRepoSettings,
        gitHubWebhooksEnabled,
        formData,
        useRepoSettings ? repoData : null
      ),
    [formData, gitHubWebhooksEnabled, repoData, useRepoSettings]
  );

  if (!formData) return null;

  return (
    <>
      {!gitHubWebhooksEnabled && (
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
        validate={validate}
        disabled={isProduction() && !gitHubWebhooksEnabled} // TODO: Remove once EVG-16208 is fixed
      />
    </>
  );
};

const pairHasError = (regex: string, tags: string[]): boolean => {
  const hasInvalidTags =
    !tags || !tags?.length || tags.every((tag) => tag === "");
  return regex === "" && hasInvalidTags;
};

const aliasHasError = ({
  task,
  taskTags,
  variant,
  variantTags,
}: AliasType): boolean =>
  pairHasError(task, taskTags) || pairHasError(variant, variantTags);

const validate = (
  formData: FormState,
  errors
): ReturnType<SpruceFormProps["validate"]> => {
  const {
    github: {
      prTesting: { githubPrAliases },
      githubChecks: { githubCheckAliases },
    },
  } = formData;

  githubPrAliases.forEach((alias, i) => {
    if (aliasHasError(alias)) {
      errors.github.prTesting.githubPrAliases[i].addError("Missing field");
    }
  });

  githubCheckAliases.forEach((alias, i) => {
    if (aliasHasError(alias)) {
      errors.github.githubChecks.githubCheckAliases[i].addError(
        "Missing field"
      );
    }
  });

  return errors;
};
