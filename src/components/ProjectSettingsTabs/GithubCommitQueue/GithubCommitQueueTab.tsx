import { useMemo } from "react";
import { SpruceForm } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { usePopulateForm, useProjectSettingsContext } from "../Context";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.GithubCommitQueue;

const getInitialFormState = (projectData, repoData) => {
  if (!projectData) return repoData;
  if (repoData) {
    // Merge project and repo objects so that repo config can be displayed on project pages
    const {
      github: { prTesting, githubChecks, users, teams },
    } = repoData;
    const mergedObject = projectData;
    mergedObject.github.prTesting.repoData = prTesting;
    mergedObject.github.githubChecks.repoData = githubChecks;
    mergedObject.github.users.repoData = users;
    mergedObject.github.teams.repoData = teams;
    return mergedObject;
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
    />
  );
};
