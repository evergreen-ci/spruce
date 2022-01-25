import { useMemo } from "react";
import { SpruceForm } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { usePopulateForm, useProjectSettingsContext } from "../Context";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.Plugins;

export const PluginsTab: React.FC<TabProps> = ({
  projectData,
  repoData,
  useRepoSettings,
}) => {
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData } = getTab(tab);
  console.log(formData);

  const initialFormState = projectData || repoData;
  usePopulateForm(initialFormState, tab);

  const onChange = updateForm(tab);

  const { fields, schema, uiSchema } = useMemo(
    () =>
      getFormSchema(
        useRepoSettings,
        useRepoSettings ? repoData : null,
        formData
      ),
    [repoData, useRepoSettings, formData]
  );

  if (!formData) return null;

  return (
    <SpruceForm
      fields={fields}
      formData={formData}
      onChange={onChange}
      schema={schema}
      validate={validate}
      uiSchema={uiSchema}
    />
  );
};

/* Display an error and prevent saving if a user enters something invalid. */
const validate = (formData, errors) => {
  const searchProject = formData?.buildBaronSettings?.ticketSearchProjects;

  // if a search project is defined, a create project must be defined, and vice versa
  const searchProjectDefined =
    searchProject?.length !== 0 &&
    searchProject?.[0]?.searchProject !== undefined;
  const createProjectDefined =
    formData?.buildBaronSettings?.ticketCreateProject?.createProject !== "";

  if (searchProjectDefined && !createProjectDefined) {
    errors.buildBaronSettings?.ticketCreateProject?.createProject.addError(
      "You must specify a create project."
    );
  }

  if (createProjectDefined && !searchProjectDefined) {
    errors.buildBaronSettings?.ticketCreateProject?.createProject.addError(
      "You must also specify at least one ticket search project above."
    );
  }

  // a webhook must contain both a secret and an endpoint
  const fileTicketWebhookDefined =
    formData?.buildBaronSettings?.fileTicketWebhook?.endpoint !== "";
  const fileTicketSecretDefined =
    formData?.buildBaronSettings?.fileTicketWebhook?.secret !== "";

  if (fileTicketSecretDefined && !fileTicketWebhookDefined) {
    errors.buildBaronSettings?.fileTicketWebhook?.endpoint.addError(
      "You must specify a webhook to use with the secret."
    );
  }

  if (fileTicketWebhookDefined && !fileTicketSecretDefined) {
    errors.buildBaronSettings?.fileTicketWebhook?.secret?.addError(
      "You must specify a secret to use with the webhook."
    );
  }

  // each jira custom field must contain both a display text and a custom field
  formData.buildBaronSettings?.taskAnnotationSettings?.jiraCustomFields.forEach(
    (field, i) => {
      if (field?.field === undefined) {
        formData.buildBaronSettings?.taskAnnotationSettings?.jiraCustomFields?.[
          i
        ]?.field?.addValue("");
      }
      const fieldUndefined = field?.field === undefined || field?.field === "";
      const displayTextUndefined =
        field?.displayText === undefined || field?.displayText === "";

      if (!fieldUndefined && displayTextUndefined) {
        errors.buildBaronSettings?.taskAnnotationSettings?.jiraCustomFields?.[
          i
        ]?.field?.addError("You must also specify a display text below.");
      }
      if (!displayTextUndefined && fieldUndefined) {
        errors.buildBaronSettings?.taskAnnotationSettings?.jiraCustomFields?.[
          i
        ]?.displayText?.addError("You must also specify a custom field above.");
      }
    }
  );

  return errors;
};
