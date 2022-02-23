import { useMemo } from "react";
import { SpruceForm } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { usePopulateForm, useProjectSettingsContext } from "../Context";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.Plugins;

export const PluginsTab: React.FC<TabProps> = ({
  projectData,
  projectType,
  repoData,
}) => {
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData } = getTab(tab);

  const initialFormState = projectData || repoData;
  usePopulateForm(initialFormState, tab);

  const onChange = updateForm(tab);

  const { fields, schema, uiSchema } = useMemo(
    () =>
      getFormSchema(
        projectType === ProjectType.AttachedProject ? repoData : null,
        formData
      ),
    [projectType, repoData, formData]
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
    searchProject?.[0]?.searchProject !== undefined &&
    searchProject?.[0]?.searchProject.trim() !== "";

  const createProjectDefined =
    formData?.buildBaronSettings?.ticketCreateProject?.createProject.trim() !==
    "";

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
    formData?.buildBaronSettings?.fileTicketWebhook?.endpoint.trim() !== "";
  const fileTicketSecretDefined =
    formData?.buildBaronSettings?.fileTicketWebhook?.secret.trim() !== "";

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
      const fieldUndefined =
        field?.field === undefined || field?.field.trim() === "";
      const displayTextUndefined =
        field?.displayText === undefined || field?.displayText.trim() === "";

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
