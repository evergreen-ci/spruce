import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { form } from "../utils";
import { PluginsFormState } from "./types";

const { placeholderIf, radioBoxOptions } = form;

const requesters = [
  {
    label: "Commits",
    value: "gitter_request",
  },
  {
    label: "Patches",
    value: "patch_request",
  },
  {
    label: "GitHub Pull Requests",
    value: "github_pull_request",
  },
  {
    label: "Commit Queue Merge",
    value: "merge_test",
  },
  {
    label: "Periodic Builds",
    value: "ad_hoc",
  },
];

export const getFormSchema = (
  repoData?: PluginsFormState
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    properties: {
      buildBaronSettings: {
        dependencies: {
          useBuildBaron: {
            oneOf: [
              {
                dependencies: {
                  ticketCreateProject: ["ticketSearchProjects"],
                  ticketSearchProjects: ["ticketCreateProject"],
                },
                properties: {
                  ticketCreateProject: {
                    properties: {
                      createProject: {
                        title: "",
                        type: "string" as "string",
                      },
                    },
                    title: "Ticket Create Project",
                    type: "object" as "object",
                  },
                  ticketSearchProjects: {
                    items: {
                      properties: {
                        searchProject: {
                          default: "",
                          minLength: 1,
                          title: "Search Project",
                          type: "string" as "string",
                        },
                      },
                      type: "object" as "object",
                    },
                    title: "Ticket Search Projects",
                    type: "array" as "array",
                  },
                  useBuildBaron: {
                    enum: [true],
                  },
                },
              },
              {
                properties: {
                  fileTicketWebhook: {
                    properties: {
                      endpoint: {
                        default: "",
                        minLength: 1,
                        title: "Webhook Endpoint",
                        type: "string" as "string",
                      },
                      secret: {
                        default: "",
                        minLength: 1,
                        title: "Webhook Secret",
                        type: "string" as "string",
                      },
                    },
                    title: "Custom Ticket Creation",
                    type: "object" as "object",
                  },
                  useBuildBaron: {
                    enum: [false],
                  },
                },
              },
            ],
          },
        },
        properties: {
          taskAnnotationSettings: {
            properties: {
              jiraCustomFields: {
                items: {
                  properties: {
                    displayText: {
                      default: "",
                      minLength: 1,
                      title: "Display Text",
                      type: "string" as "string",
                    },
                    field: {
                      default: "",
                      minLength: 1,
                      title: "Field",
                      type: "string" as "string",
                    },
                  },
                  type: "object" as "object",
                },
                title: "Custom JIRA Fields",
                type: "array" as "array",
              },
            },
            title: "",
            type: "object" as "object",
          },
          useBuildBaron: {
            oneOf: radioBoxOptions([
              "JIRA Ticket Search and Create",
              "Custom Ticket Creation",
            ]),
            type: "boolean" as "boolean",
          },
        },
        title: "Ticket Creation",
        type: "object" as "object",
      },
      externalLinks: {
        properties: {
          metadataPanelLink: {
            description:
              "Add a URL to the metadata panel for versions with the specified requester. Include {version_id} in the URL template and it will be replaced by an actual version ID.",
            properties: {
              displayName: {
                maxLength: 40,
                title: "Display name",
                type: "string" as "string",
              },
              requesters: {
                items: {
                  anyOf: requesters.map((r) => ({
                    enum: [r.value],
                    title: r.label,
                    type: "string" as "string",
                  })),
                  type: "string" as "string",
                },
                title: "Requesters",
                type: "array" as "array",
                uniqueItems: true,
              },
              urlTemplate: {
                format: "validURLTemplate",
                title: "URL template",
                type: "string" as "string",
              },
            },
            title: "",
            type: "object" as "object",
          },
        },
        title: "Metadata Link",
        type: "object" as "object",
      },
      performanceSettings: {
        properties: {
          perfEnabled: {
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.performanceSettings?.perfEnabled
            ),
            title: "",
            type: ["boolean", "null"],
          },
        },
        title: "Performance Plugins",
        type: "object" as "object",
      },
    },
    type: "object" as "object",
  },
  uiSchema: {
    buildBaronSettings: {
      fileTicketWebhook: {
        endpoint: placeholderIf(
          repoData?.buildBaronSettings?.fileTicketWebhook?.endpoint
        ),
        secret: placeholderIf(
          repoData?.buildBaronSettings?.fileTicketWebhook?.secret
        ),
        "ui:description":
          "Specify the endpoint and secret for a custom webhook to be called when the File Ticket button is clicked on a failing task.",
      },
      taskAnnotationSettings: {
        jiraCustomFields: {
          "ui:addButtonText": "Add Custom JIRA Field",
          "ui:description":
            "Add any custom JIRA fields that you want displayed on any listed JIRA tickets, for example: assigned teams.",
          "ui:orderable": false,
        },
        "ui:rootFieldId": "taskAnnotation",
      },
      ticketCreateProject: {
        "ui:description":
          "Specify an existing JIRA project to create tickets in when the File Ticket button is clicked on a failing task.",
      },
      ticketSearchProjects: {
        "ui:addButtonText": "Add Search Project",
        "ui:description":
          "Specify an existing JIRA project to search for tickets related to a failing task",
        "ui:orderable": false,
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "buildBaron",
      useBuildBaron: {
        "ui:data-cy": "enabled-radio-box",
        "ui:showLabel": false,
        "ui:widget": widgets.RadioBoxWidget,
      },
    },
    externalLinks: {
      metadataPanelLink: {
        displayName: {
          "ui:data-cy": "display-name-input",
        },
        requesters: {
          "ui:data-cy": "requesters-input",
          "ui:widget": widgets.MultiSelectWidget,
        },
        urlTemplate: {
          "ui:data-cy": "url-template-input",
          "ui:placeholder": "https://example.com/{version_id}",
        },
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "externalLinks",
    },
    performanceSettings: {
      perfEnabled: {
        "ui:description":
          "Enable the performance plugin (this requires the project to have matching ID and identifier).",
        "ui:widget": widgets.RadioBoxWidget,
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "plugins",
    },
  },
});
