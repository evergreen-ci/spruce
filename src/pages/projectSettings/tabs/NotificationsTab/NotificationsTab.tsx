import { useMemo } from "react";
import { SpruceForm } from "components/SpruceForm";
import { ValidateProps } from "components/SpruceForm/types";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { invalidProjectTriggerSubscriptionCombinations } from "constants/triggers";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "pages/projectSettings/Context";
import { ProjectType } from "../utils";
import { getFormSchema } from "./getFormSchema";
import { FormState, TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.Notifications;

export const NotificationsTab: React.VFC<TabProps> = ({
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
        projectType === ProjectType.AttachedProject ? repoData : null
      ),
    [projectType, repoData]
  );
  if (!formData) return null;

  return (
    <SpruceForm
      fields={fields}
      formData={formData}
      onChange={onChange}
      schema={schema}
      uiSchema={uiSchema}
      validate={validator as any}
    />
  );
};

const validator: ValidateProps<FormState> = (formData, errors) => {
  const { subscriptions } = formData;

  for (let i = 0; i < subscriptions.length; i++) {
    const subscription = subscriptions[i];
    const { subscriptionData } = subscription;
    const { event, notification } = subscriptionData;
    const { notificationSelect } = notification;
    const { eventSelect } = event;

    Object.entries(invalidProjectTriggerSubscriptionCombinations).forEach(
      ([notificationType, eventType]) => {
        if (notificationSelect === notificationType) {
          const hasMatchingEvent = eventType.some((e) => e === eventSelect);
          if (hasMatchingEvent) {
            errors.subscriptions[
              i
            ].subscriptionData?.notification?.notificationSelect?.addError(
              "JIRA comment subscription not allowed for tasks in a project"
            );
          }
        }
      }
    );
  }
  return errors;
};
