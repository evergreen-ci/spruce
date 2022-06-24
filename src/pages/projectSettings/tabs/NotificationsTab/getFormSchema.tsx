import { Field } from "@rjsf/core";
import { getEventSchema } from "components/Notifications/form/event";
import { getNotificationSchema } from "components/Notifications/form/notification";
import { SpruceFormProps } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { projectTriggers } from "constants/triggers";
import { projectSubscriptionMethods as subscriptionMethods } from "types/subscription";
import { radioBoxOptions } from "../utils/form";
import { SubscriptionField } from "./SubscriptionField";
import { FormState } from "./types";

export const getFormSchema = (
  repoData?: FormState
): {
  fields: Record<string, Field>;
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => {
  const { schema: eventSchema, uiSchema: eventUiSchema } = getEventSchema(
    [],
    projectTriggers
  );
  const {
    schema: notificationSchema,
    uiSchema: notificationUiSchema,
  } = getNotificationSchema(subscriptionMethods);

  return {
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
            properties: {
              subscriptionData: {
                type: "object" as "object",
                title: "",
                properties: {
                  event: eventSchema,
                  notification: notificationSchema,
                },
              },
              subscriberData: {
                type: "object" as "object",
                properties: {},
              },
            },
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
        "ui:useExpandableCard": true,
        items: {
          "ui:displayTitle": "New Subscription",
          subscriptionData: {
            event: eventUiSchema,
            notification: notificationUiSchema,
          },
          subscriberData: {
            "ui:field": "subscriptionField",
            "ui:border": "top",
          },
        },
      },
    },
  };
};
