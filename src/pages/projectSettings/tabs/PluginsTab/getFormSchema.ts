import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { form } from "../utils";
import { FormState } from "./types";

const { hiddenIf, placeholderIf, radioBoxOptions } = form;

export const getFormSchema = (
  repoData?: FormState,
  formData?: FormState
): {
  fields: Record<string, Field>;
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      performanceSettings: {
        type: "object" as "object",
        title: "Performance Plugins",
        properties: {
          perfEnabled: {
            type: ["boolean", "null"],
            title: "",
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.performanceSettings?.perfEnabled
            ),
          },
        },
      },
      buildBaronSettings: {
        type: "object" as "object",
        title: "Build Baron and Task Annotations",
        properties: {
          taskAnnotationSettings: {
            title: "",
            type: "object" as "object",
            properties: {
              jiraCustomFields: {
                type: "array" as "array",
                title: "Custom JIRA Fields",
                items: {
                  type: "object" as "object",
                  properties: {
                    field: {
                      type: "string" as "string",
                      title: "Field",
                    },
                    displayText: {
                      type: "string" as "string",
                      title: "Display Text",
                    },
                  },
                },
              },
            },
          },
          useBuildBaron: {
            type: "boolean" as "boolean",
            oneOf: radioBoxOptions(
              [
                "Build Baron Ticket Search and Create",
                "Custom Ticket Creation",
              ],
              undefined
            ),
          },
          ticketSearchProjects: {
            type: "array" as "array",
            title: "Ticket Search Projects",
            items: {
              type: "object" as "object",
              properties: {
                searchProject: {
                  type: "string" as "string",
                  title: "Search Project",
                },
              },
            },
          },
          ticketCreateProject: {
            type: "object" as "object",
            title: "Ticket Create Project",
            properties: {
              createProject: {
                type: "string" as "string",
                title: "",
              },
            },
          },

          fileTicketWebhook: {
            type: "object" as "object",
            title: "Custom Ticket Creation",
            properties: {
              endpoint: {
                type: "string" as "string",
                title: "Webhook Endpoint",
              },
              secret: {
                type: "string" as "string",
                title: "Webhook Secret",
              },
            },
          },
        },
      },
    },
  },
  uiSchema: {
    performanceSettings: {
      "ui:rootFieldId": "plugins",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      perfEnabled: {
        "ui:widget": widgets.RadioBoxWidget,
      },
    },
    buildBaronSettings: {
      "ui:rootFieldId": "buildBaron",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      taskAnnotationSettings: {
        "ui:rootFieldId": "taskAnnotation",
        jiraCustomFields: {
          "ui:description":
            "Add any custom JIRA fields that you want displayed on any listed JIRA tickets, for example: assigned teams.",
          "ui:addButtonText": "Add custom JIRA field",
          "ui:orderable": false,
        },
      },
      useBuildBaron: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:showLabel": false,
        "ui:data-cy": "enabled-radio-box",
      },
      ticketSearchProjects: {
        "ui:description":
          "Specify an existing JIRA project to search for tickets related to a failing task",
        ...hiddenIf(formData?.buildBaronSettings.useBuildBaron !== true),
        "ui:addButtonText": "Add Search Project",
        "ui:orderable": false,
      },
      ticketCreateProject: {
        "ui:description":
          "Specify an existing JIRA project to create tickets in when the File Ticket button is clicked on a failing task.",
        ...hiddenIf(formData?.buildBaronSettings.useBuildBaron !== true),
      },
      fileTicketWebhook: {
        ...hiddenIf(formData?.buildBaronSettings.useBuildBaron === true),
        "ui:description":
          "Specify the endpoint and secret for a custom webhook to be called when the File Ticket button is clicked on a failing task.",
        endpoint: placeholderIf(
          repoData?.buildBaronSettings?.fileTicketWebhook?.endpoint
        ),
        secret: placeholderIf(
          repoData?.buildBaronSettings?.fileTicketWebhook?.secret
        ),
      },
    },
  },
});
