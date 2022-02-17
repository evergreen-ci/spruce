import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { form } from "../utils";
import { DefaultSubscriptionsField } from "./Fields/DefaultSubscriptionsField";
import { FormState } from "./types";

const { radioBoxOptions } = form;

export const getFormSchema = (
  useRepoSettings: boolean,
  repoData?: FormState
): {
  fields: Record<string, Field>;
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  fields: {
    defaultSubscriptionsField: DefaultSubscriptionsField,
  },
  schema: {
    type: "object" as "object",
    properties: {
      buildBreakSettings: {
        type: "object" as "object",
        title: "Notifications",
        properties: {
          notifyOnBuildFailure: {
            type: ["boolean", "null"],
            title: "Build-break Notifications",
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.buildBreakSettings?.notifyOnBuildFailure
            ),
          },
        },
      },
      defaultSubscriptions: {
        type: "object" as "object",
        title: "Subscriptions",
        properties: {
          defaultToRepo: {
            type: ["array", "null"],
            items: {
              type: "object" as "object",
              properties: {
                filePattern: {
                  type: "string" as "string",
                  title: "TODO: EVG-16262 - this is not implemented yet",
                },
              },
            },
          },
        },
      },
    },
  },
  uiSchema: {
    buildBreakSettings: {
      "ui:rootFieldId": "notifications",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      notifyOnBuildFailure: {
        "ui:widget": widgets.RadioBoxWidget,
      },
    },
    defaultSubscriptions: {
      defaultToRepo: {
        "ui:addButtonText": "Add New Subscription",
        "ui:field": "defaultSubscriptionsField",
        options: { useRepoSettings },
      },
    },
  },
});
