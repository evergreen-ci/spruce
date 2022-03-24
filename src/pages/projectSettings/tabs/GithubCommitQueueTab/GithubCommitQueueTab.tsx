import { useMemo } from "react";
import Banner from "@leafygreen-ui/banner";
import { useParams } from "react-router-dom";
import { SpruceForm } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "pages/projectSettings/Context";
import { environmentalVariables } from "utils";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { mergeProjectRepo } from "./transformers";
import { FormState, TabProps } from "./types";

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
  githubWebhooksEnabled,
  projectData,
  projectType,
  repoData,
}) => {
  const { identifier } = useParams<{ identifier: string }>();
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
        identifier,
        projectType,
        githubWebhooksEnabled,
        formData,
        projectType === ProjectType.AttachedProject ? repoData : null
      ),
    [formData, githubWebhooksEnabled, identifier, projectType, repoData]
  );

  if (!formData) return null;

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
        disabled={isProduction() && !githubWebhooksEnabled} // TODO: Remove once EVG-16208 is fixed
      />
    </>
  );
};
