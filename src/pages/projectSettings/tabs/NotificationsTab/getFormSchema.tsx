import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { GetFormSchema } from "../types";
import { radioBoxOptions } from "../utils/form";
import { SubscriptionField } from "./SubscriptionField";
import { FormState } from "./types";

export const getFormSchema: GetFormSchema<ProjectSettingsTabRoutes.Notifications> = (
  repoData?: FormState
) => ({
  fields: {
    subscriptionField: SubscriptionField,
  },
  schema: {
    type: "object" as "object",
    properties: {
      buildBreakSettings: {
        type: "object" as "object",
        title: "Performance Plugins",
        properties: {
          notifyOnBuildFailure: {
            type: ["boolean", "null"],
            title: "Build Break Notifications",
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.buildBreakSettings?.notifyOnBuildFailure
            ),
          },
        },
      },
      subscriptions: {
        type: "array" as "array",
        title: "Subscriptions",
        items: {
          type: "object" as "object",
        },
      },
    },
  },
  uiSchema: {
    buildBreakSettings: {
      "ui:rootFieldId": "plugins",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      notifyOnBuildFailure: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:description":
          "Send notification of build breaks to admins of a project if the commit author is not signed up to receive notifications.",
      },
    },
    subscriptions: {
      "ui:placeholder": "No subscription are defined.",
      "ui:addButtonText": "Add Subscription",
      "ui:orderable": false,
      items: {
        "ui:field": "subscriptionField",
      },
    },
  },
});
