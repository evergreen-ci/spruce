import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { placeholderIf, radioBoxOptions } from "../utils";

export const getFormSchema = (
  useRepoSettings: boolean,
  repoData?: any,
  formData?: any
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
            title: "Build-break notifications",
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.performanceSettings?.perfEnabled
            ),
          },
        },
      },
      buildBaronSettings: {
        type: "object" as "object",
        title: "Build Baron",
        properties: {
          ticketSearchProjects: {
            type: ["array", "null"],
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
            type: ["boolean", "null"],
            oneOf: radioBoxOptions(
              ["Custom Ticket Creation", "Build Baron Ticket Creation"],
              undefined
            ),
          },
          ticketCreateProject: {
            type: ["string", "null"],
            title: "Ticket Create Project",
          },
          taskAnnotationSettings: {
            title: "Custom Ticket Creation",
            type: "object" as "object",
            properties: {
              fileTicketWebhook: {
                type: "object" as "object",
                title: "Webhook",
                properties: {
                  endpoint: {
                    type: ["string", "null"],
                    title: "Endpoint",
                  },
                  secret: {
                    type: ["string", "null"],
                    title: "Secret",
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
      "ui:description":
        "Define either a webhook for custom build failure ticket creation, or specify existing JIRA projects.",
      "ui:rootFieldId": "buildBaron",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      ticketSearchProjects: {
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
        "ui:disabled": formData?.buildBaronSettings.customTicket === true,
        //   formData?.buildBaronSettings?.fileTicketWebhook?.endpoint !== null,
        "ui:description":
          "Define either a webhook for custom build failure ticket creation, or specify existing JIRA projects.",
        ...placeholderIf(
          repoData?.projectPluginsSettings?.buildBaronSettings
            ?.ticketCreateProject
        ),
        options: {
          useRepoSettings,
        },
      },
      taskAnnotationSettings: {
        "ui:disabled": formData?.buildBaronSettings.customTicket !== true,
        "ui:rootFieldId": "taskAnnotation",
        "ui:showLabel": false,
        jiraCustomFields: {
          ...placeholderIf(
            repoData?.projectPluginsSettings?.taskAnnotationSettings
              ?.jiraCustomFields
          ),
          "ui:fullWidth": true,
          "ui:buttonText": "Add custom Jira field",
          "ui:buttonDisabled":
            formData?.buildBaronSettings.customTicket !== true,
          "ui:showLabel": false,
          options: {
            useRepoSettings,
          },
        },
        fileTicketWebhook: {
          "ui:disabled": formData?.buildBaronSettings.customTicket !== true,
          "ui:showLabel": false,
          "ui:visible": false,
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
