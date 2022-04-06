import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { Project } from "gql/generated/types";
import { form, ProjectType } from "../utils";
import { RepoConfigField, RepotrackerField } from "./Fields";
import { FormState } from "./types";

const { insertIf, overrideRadioBox, placeholderIf, radioBoxOptions } = form;

export const getFormSchema = (
  projectId: string,
  projectType: ProjectType,
  validDefaultLoggers: Project["validDefaultLoggers"],
  identifierHasChanges: boolean,
  repoData?: FormState
): {
  fields: Record<string, Field>;
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  fields: {
    repoConfigField: RepoConfigField,
    repotrackerField: RepotrackerField,
  },
  schema: {
    type: "object" as "object",
    properties: {
      generalConfiguration: {
        type: "object" as "object",
        title: "General Configuration",
        properties: {
          enabled: {
            type: ["boolean", "null"],
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.generalConfiguration?.enabled
            ),
          },
          repositoryInfo: {
            type: "object" as "object",
            title: "Repository Info",
            properties: {
              owner: {
                type: ["string", "null"],
                title: "Owner",
              },
              repo: {
                type: ["string", "null"],
                title: "Repository",
              },
            },
          },
          branch: {
            type: ["string", "null"],
            title: "Branch Name",
          },
          other: {
            type: "object" as "object",
            title: "Other",
            properties: {
              displayName: {
                type: ["string", "null"],
                title: "Display Name",
              },
              ...(projectType !== ProjectType.Repo && {
                identifier: {
                  type: "string" as "string",
                  title: "Identifier",
                  default: "",
                  minLength: 1,
                },
              }),
              batchTime: {
                type: ["number", "null"],
                title: "Batch Time",
              },
              remotePath: {
                type: ["string", "null"],
                title: "Config File",
              },
              spawnHostScriptPath: {
                type: ["string", "null"],
                title: "Spawn Host Script Path",
              },
            },
          },
        },
      },
      projectFlags: {
        type: "object" as "object",
        title: "Project Flags",
        properties: {
          dispatchingDisabled: {
            type: ["boolean", "null"],
            title: "Dispatching",
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.projectFlags?.dispatchingDisabled,
              true
            ),
          },
          scheduling: {
            type: "object" as "object",
            title: "Scheduling Settings",
            properties: {
              deactivatePrevious: {
                type: ["boolean", "null"],
                title: "Old Task on Success",
                oneOf: radioBoxOptions(
                  ["Unschedule", "Don't Unschedule"],
                  repoData?.projectFlags?.scheduling?.deactivatePrevious
                ),
              },
            },
          },
          repotracker: {
            type: "object" as "object",
            title: "Repotracker Settings",
            properties: {
              repotrackerDisabled: {
                type: ["boolean", "null"],
                title: "Repotracker",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.projectFlags?.repotracker?.repotrackerDisabled,
                  true
                ),
              },
            },
          },
          logger: {
            type: "object" as "object",
            title: "Default Logger",
            properties: {
              defaultLogger: {
                default: null,
                type: [
                  "string",
                  ...insertIf(
                    projectType === ProjectType.AttachedProject,
                    "null"
                  ),
                ],
                enum: [
                  ...validDefaultLoggers,
                  ...insertIf(
                    projectType === ProjectType.AttachedProject,
                    null
                  ),
                ],
              },
            },
          },
          testResults: {
            type: "object" as "object",
            title: "Test Results",
            properties: {
              cedarTestResultsEnabled: {
                type: ["boolean", "null"],
                title: "Cedar Test Results",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.projectFlags?.testResults?.cedarTestResultsEnabled
                ),
              },
            },
          },
          patch: {
            type: "object" as "object",
            title: "Patch Settings",
            properties: {
              patchingDisabled: {
                type: ["boolean", "null"],
                title: "Patching",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.projectFlags?.patch?.patchingDisabled,
                  true
                ),
              },
            },
          },
          taskSync: {
            type: "object" as "object",
            title: "Task Sync",
            properties: {
              configEnabled: {
                type: ["boolean", "null"],
                title: "Project Config Commands",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.projectFlags?.taskSync.configEnabled
                ),
              },
              patchEnabled: {
                type: ["boolean", "null"],
                title: "Task in Patches",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.projectFlags?.taskSync.patchEnabled
                ),
              },
            },
          },
        },
      },
      historicalDataCaching: {
        type: "object" as "object",
        title: "Historical Data Caching Info",
        properties: {
          disabledStatsCache: {
            type: ["boolean", "null"],
            title: "Caching",
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.historicalDataCaching?.disabledStatsCache,
              true
            ),
          },
          files: {
            type: "object" as "object",
            title: "File Patterns to Ignore",
            description:
              "Comma-separated list of regular expression patterns that specify test filenames to ignore when caching test and task history.",
            ...overrideRadioBox(
              "filesIgnoredFromCache",
              ["Override Repo File Pattern", "Default to Repo File Pattern"],
              {
                type: ["array", "null"],
                items: {
                  type: "string" as "string",
                  title: "File Pattern",
                  default: "",
                },
              }
            ),
          },
        },
      },
    },
  },
  uiSchema: {
    generalConfiguration: {
      "ui:rootFieldId": "generalConfiguration",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      enabled: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:showLabel": false,
        "ui:data-cy": "enabled-radio-box",
      },
      repositoryInfo: {
        "ui:field": "repoConfigField",
        "ui:disabled": projectType !== ProjectType.Project,
        options: {
          projectId,
          projectType,
          repoName: repoData?.generalConfiguration?.repositoryInfo?.repo,
          repoOwner: repoData?.generalConfiguration?.repositoryInfo?.owner,
        },
        owner: {
          ...placeholderIf(
            repoData?.generalConfiguration?.repositoryInfo?.owner
          ),
        },
        repo: {
          "ui:data-cy": "repo-input",
          ...placeholderIf(
            repoData?.generalConfiguration?.repositoryInfo?.repo
          ),
        },
      },
      branch: {
        ...placeholderIf(repoData?.generalConfiguration?.branch),
      },
      other: {
        displayName: {
          "ui:data-cy": "display-name-input",
        },
        ...(identifierHasChanges && {
          identifier: {
            "ui:warnings": [
              "Updates made to the project identifier will change the identifier used for the CLI, inter-project dependencies, etc. Project users should be made aware of this change, as the old identifier will no longer work.",
            ],
          },
        }),
        batchTime: {
          "ui:description":
            "The interval of time (in minutes) that Evergreen should wait in between activating the latest version.",
          ...placeholderIf(repoData?.generalConfiguration?.other?.batchTime),
        },
        remotePath: {
          ...placeholderIf(repoData?.generalConfiguration?.other?.remotePath),
        },
        spawnHostScriptPath: {
          "ui:description":
            "This is the bash setup script to optionally run on spawn hosts created from tasks.",
          "ui:data-cy": "spawn-host-input",
          ...placeholderIf(
            repoData?.generalConfiguration?.other?.spawnHostScriptPath
          ),
        },
      },
    },
    projectFlags: {
      "ui:rootFieldId": "projectFlags",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      dispatchingDisabled: {
        "ui:widget": widgets.RadioBoxWidget,
      },
      scheduling: {
        deactivatePrevious: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "When unscheduled, tasks from previous revisions will be unscheduled when the equivalent task in a newer commit finishes successfully.",
        },
      },
      repotracker: {
        "ui:field": "repotrackerField",
        options: { projectId },
        repotrackerDisabled: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "Repotracker will be triggered from GitHub push events sent via webhook.",
        },
      },
      logger: {
        defaultLogger: {
          "ui:placeholder": repoData
            ? `Default to Repo (${repoData?.projectFlags?.logger?.defaultLogger})`
            : "Select Default Logger",
          ...(projectType !== ProjectType.AttachedProject && {
            "ui:allowDeselect": false,
          }),
          "ui:ariaLabelledBy": "projectFlags_logger__title",
          "ui:data-cy": "default-logger-select",
        },
      },
      testResults: {
        cedarTestResultsEnabled: {
          "ui:widget": widgets.RadioBoxWidget,
        },
      },
      patch: {
        patchingDisabled: {
          "ui:widget": widgets.RadioBoxWidget,
        },
      },
      taskSync: {
        configEnabled: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "Enable commands (e.g. s3.push, s3.pull) to sync the task directory in S3 from the config file.",
        },
        patchEnabled: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "Users can create patches that sync the task directory to S3 at the end of any task.",
        },
      },
    },
    historicalDataCaching: {
      "ui:rootFieldId": "historicalDataCaching",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      disabledStatsCache: {
        "ui:widget": widgets.RadioBoxWidget,
      },
      files: {
        filesIgnoredFromCacheOverride: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:showLabel": false,
        },
        filesIgnoredFromCache: {
          "ui:addButtonText": "Add File Pattern",
          "ui:orderable": false,
          "ui:showLabel": false,
        },
        repoData: {
          filesIgnoredFromCache: {
            "ui:disabled": true,
            "ui:readonly": true,
            "ui:showLabel": false,
          },
        },
      },
    },
  },
});
