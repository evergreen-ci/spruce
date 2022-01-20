import { useMemo } from "react";
import { SpruceForm } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { usePopulateForm, useProjectSettingsContext } from "../Context";
import { getFormSchema } from "./getFormSchema";
import { mergeProjectRepo } from "./transformers";
import { AliasType, FormState, TabProps } from "./types";

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
    <SpruceForm
      fields={fields}
      formData={formData}
      onChange={onChange}
      schema={schema}
      uiSchema={uiSchema}
      validate={validate}
    />
  );
};

const pairHasError = (regex: string, tags: string[]) => {
  const hasInvalidTags =
    !tags || !tags?.length || tags.every((tag) => tag === "");
  return regex === "" && hasInvalidTags;
};

const aliasHasError = ({ task, taskTags, variant, variantTags }: AliasType) =>
  pairHasError(task, taskTags) || pairHasError(variant, variantTags);

const validate = (formData: FormState, errors) => {
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
