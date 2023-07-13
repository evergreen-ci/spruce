import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { GetFormSchema } from "../types";
import { form } from "../utils";
import { PluginsFormState } from "./types";

const { placeholderIf, radioBoxOptions } = form;

export const getFormSchema = (
  repoData?: PluginsFormState
): ReturnType<GetFormSchema> => ({
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
        title: "Ticket Creation",
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
                      minLength: 1,
                      default: "",
                    },
                    displayText: {
                      type: "string" as "string",
                      title: "Display Text",
                      minLength: 1,
                      default: "",
                    },
                  },
                },
              },
            },
          },
          useBuildBaron: {
            type: "boolean" as "boolean",
            oneOf: radioBoxOptions([
              "JIRA Ticket Search and Create",
              "Custom Ticket Creation",
            ]),
          },
        },
        dependencies: {
          useBuildBaron: {
            oneOf: [
              {
                dependencies: {
                  ticketSearchProjects: ["ticketCreateProject"],
                  ticketCreateProject: ["ticketSearchProjects"],
                },
                properties: {
                  useBuildBaron: {
                    enum: [true],
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
                          minLength: 1,
                          default: "",
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
                },
              },
              {
                properties: {
                  useBuildBaron: {
                    enum: [false],
                  },
                  fileTicketWebhook: {
                    type: "object" as "object",
                    title: "Custom Ticket Creation",
                    properties: {
                      endpoint: {
                        type: "string" as "string",
                        title: "Webhook Endpoint",
                        minLength: 1,
                        default: "",
                      },
                      secret: {
                        type: "string" as "string",
                        title: "Webhook Secret",
                        minLength: 1,
                        default: "",
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      },
      externalLinks: {
        type: "object" as "object",
        title: "Patch Metadata Link",
        properties: {
          patchMetadataPanelLink: {
            type: "object" as "object",
            title: "",
            description:
              "Add a URL to the patch metadata panel to share a custom link with anyone viewing a patch from this project. Include {version_id} in the URL template and it will be replaced by an actual version ID.",
            properties: {
              displayName: {
                type: "string" as "string",
                title: "Display name",
                maxLength: 40,
              },
              urlTemplate: {
                type: "string" as "string",
                title: "URL template",
                format: "validURLTemplate",
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
        "ui:description":
          "Enable the performance plugin (this requires the project to have matching ID and identifier).",
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
          "ui:addButtonText": "Add Custom JIRA Field",
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
        "ui:addButtonText": "Add Search Project",
        "ui:orderable": false,
      },
      ticketCreateProject: {
        "ui:description":
          "Specify an existing JIRA project to create tickets in when the File Ticket button is clicked on a failing task.",
      },
      fileTicketWebhook: {
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
    externalLinks: {
      "ui:rootFieldId": "externalLinks",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      patchMetadataPanelLink: {
        urlTemplate: {
          "ui:placeholder": "https://example.com/{version_id}",
          "ui:data-cy": "url-template-input",
        },
        displayName: {
          "ui:data-cy": "display-name-input",
        },
      },
    },
  },
});
