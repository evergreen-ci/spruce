import { Field } from "@rjsf/core";
import { FormDataProps, SpruceFormProps } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { hiddenIf, placeholderIf, radioBoxOptions } from "../utils";
import { FormState } from "./types";

export const getFormSchema = (
  useRepoSettings: boolean,
  repoData?: FormState,
  formData?: FormDataProps
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
            title: "Build-break Notifications",
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
          customTicket: {
            type: "boolean" as "boolean",
            oneOf: radioBoxOptions(
              ["Custom Ticket Creation", "JIRA Ticket Creation"],
              undefined
            ),
          },
          ticketCreateProject: {
            type: "string" as "string",
            title: "Ticket Create Project",
          },
          taskAnnotationSettings: {
            title:
              formData?.buildBaronSettings.customTicket === true
                ? "Custom Ticket Creation"
                : "",
            type: "object" as "object",
            properties: {
              fileTicketWebhook: {
                type: "object" as "object",
                title: "",
                properties: {
                  endpoint: {
                    type: ["string", "null"],
                    title: "Webhook Endpoint",
                  },
                  secret: {
                    type: ["string", "null"],
                    title: "Webhook Secret",
                  },
                },
              },
              jiraCustomFields: {
                type: "array" as "array",
                title: "Custom Jira Fields",
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
      ticketSearchProjects: {
        "ui:description":
          "Specify an existing JIRA project to search for tickets related to a failing task",
        ...placeholderIf(
          repoData?.projectPluginsSettings?.buildBaronSettings
            ?.ticketSearchProjects
        ),
        "ui:buttonText": "Add Search Project",
        options: {
          useRepoSettings,
        },
      },
      customTicket: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:showLabel": false,
        "ui:data-cy": "enabled-radio-box",
      },
      ticketCreateProject: {
        "ui:description":
          "Specify an existing JIRA project to create tickets in when the File Ticket button is clicked on a failing task.",
        ...placeholderIf(
          repoData?.projectPluginsSettings?.buildBaronSettings
            ?.ticketCreateProject
        ),
        ...hiddenIf(formData?.buildBaronSettings.customTicket === true),
        options: {
          useRepoSettings,
        },
      },
      taskAnnotationSettings: {
        "ui:rootFieldId": "taskAnnotation",
        jiraCustomFields: {
          "ui:description":
            "Add any custom Jira fields that you want displayed on any listed JIRA tickets, for example: assigned teams.",
          ...placeholderIf(
            repoData?.projectPluginsSettings?.taskAnnotationSettings
              ?.jiraCustomFields
          ),
          "ui:fullWidth": true,
          "ui:buttonText": "Add custom Jira field",
          options: {
            useRepoSettings,
          },
        },
        fileTicketWebhook: {
          ...hiddenIf(formData?.buildBaronSettings.customTicket !== true),
          "ui:description":
            "Specify the endpoint and secret for a custom webhook to be called when the File Ticket button is clicked on a failing task.",
          endpoint: {
            ...placeholderIf(
              repoData?.projectPluginsSettings?.buildBaronSettings
                ?.fileTicketWebhook?.endpoint
            ),
          },
          secret: {
            ...placeholderIf(
              repoData?.projectPluginsSettings?.buildBaronSettings
                ?.fileTicketWebhook?.secret
            ),
          },
        },
      },
    },
  },
});
