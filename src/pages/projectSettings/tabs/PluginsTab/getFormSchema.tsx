import { InlineCode } from "@leafygreen-ui/typography";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { JiraTicketType } from "types/jira";
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
  jiraEmail?: string,
  repoData?: PluginsFormState,
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
              repoData?.performanceSettings?.perfEnabled,
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
                  ticketCreateIssueType: {
                    type: "object" as "object",
                    title: "Ticket Create Issue Type",
                    properties: {
                      issueType: {
                        type: "string" as "string",
                        title: "",
                        oneOf: Object.values(JiraTicketType).map(
                          (r: string) => ({
                            type: "string" as "string",
                            title: r,
                            enum: [r],
                          }),
                        ),
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
        type: "array" as "array",
        title: "Metadata Links",
        maxItems: 5,
        items: {
          type: "object" as "object",
          properties: {
            requesters: {
              type: "array" as "array",
              title: "Requesters",
              uniqueItems: true,
              items: {
                type: "string" as "string",
                anyOf: requesters.map((r) => ({
                  type: "string" as "string",
                  title: r.label,
                  enum: [r.value],
                })),
              },
              default: [],
            },
            displayName: {
              type: "string" as "string",
              title: "Display name",
              default: "",
              minLength: 1,
              maxLength: 40,
            },
            urlTemplate: {
              type: "string" as "string",
              title: "URL template",
              default: "",
              minLength: 1,
              format: "validURLTemplate",
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
          items: {
            "ui:label": false,
          },
        },
      },
      useBuildBaron: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:showLabel": false,
        "ui:data-cy": "enabled-radio-box",
      },
      ticketSearchProjects: {
        "ui:description":
          "Specify an existing JIRA project to search for tickets related to a failing task.",
        "ui:addButtonText": "Add Search Project",
        "ui:orderable": false,
        items: {
          "ui:label": false,
        },
      },
      ticketCreateIssueType: {
        "ui:description":
          "Specify a JIRA issue type for tickets created by the File Ticket button.",
        issueType: {
          "ui:allowDeselect": false,
        },
      },
      ticketCreateProject: {
        "ui:description": (
          <>
            Specify an existing JIRA project to create tickets in when the File
            Ticket button is clicked on a failing task.
            {jiraEmail && (
              <>
                {" "}
                This project must include <InlineCode>
                  {jiraEmail}
                </InlineCode>{" "}
                as a user with create permissions.
              </>
            )}
          </>
        ),
      },
      fileTicketWebhook: {
        "ui:description":
          "Specify the endpoint and secret for a custom webhook to be called when the File Ticket button is clicked on a failing task.",
        endpoint: placeholderIf(
          repoData?.buildBaronSettings?.fileTicketWebhook?.endpoint,
        ),
        secret: placeholderIf(
          repoData?.buildBaronSettings?.fileTicketWebhook?.secret,
        ),
      },
    },
    externalLinks: {
      "ui:rootFieldId": "externalLinks",
      "ui:placeholder": "No metadata links are defined.",
      "ui:description":
        "Add URLs to the metadata panel for versions with the specified requester.",
      "ui:addButtonText": "Add metadata link",
      "ui:orderable": false,
      "ui:useExpandableCard": true,
      items: {
        "ui:displayTitle": "New Metadata Link",
        requesters: {
          "ui:widget": widgets.MultiSelectWidget,
          "ui:data-cy": "requesters-input",
        },
        displayName: {
          "ui:data-cy": "display-name-input",
        },
        urlTemplate: {
          "ui:placeholder": "https://example.com/{version_id}",
          "ui:data-cy": "url-template-input",
          "ui:description":
            "Include {version_id} in the URL template and it will be replaced by an actual version ID.",
        },
      },
    },
  },
});
