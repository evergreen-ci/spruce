import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { Project, RepoGeneralSettingsFragment } from "gql/generated/types";
import { insertIf, placeholderIf, radioBoxOptions } from "../utils";
import {
  FilesIgnoredFromCacheField,
  MoveRepoField,
  RepotrackerField,
} from "./Fields";

export const getFormData = (
  projectId: string,
  useRepoSettings: boolean,
  validDefaultLoggers: Project["validDefaultLoggers"],
  repoData?: RepoGeneralSettingsFragment
): {
  fields: Record<string, Field>;
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  fields: {
    moveRepoField: MoveRepoField,
    filesIgnoredFromCacheField: FilesIgnoredFromCacheField,
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
            oneOf: radioBoxOptions(["Enabled", "Disabled"], repoData?.enabled),
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
              repoData?.dispatchingDisabled,
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
                  repoData?.deactivatePrevious
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
                  repoData?.repotrackerDisabled,
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
                type: ["string", ...insertIf(repoData, "null")],
                enum: [...validDefaultLoggers, ...insertIf(repoData, null)],
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
                  repoData?.cedarTestResultsEnabled
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
                  repoData?.patchingDisabled,
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
                  repoData?.taskSync.configEnabled
                ),
              },
              patchEnabled: {
                type: ["boolean", "null"],
                title: "Task in Patches",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.taskSync.patchEnabled
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
              repoData?.disabledStatsCache,
              true
            ),
          },
          files: {
            type: "object" as "object",
            title: "File Patterns to Ignore",
            description:
              "Comma-separated list of regular expression patterns that specify test filenames to ignore when caching test and task history.",
            properties: {
              filesIgnoredFromCache: {
                type: ["array", "null"],
                items: {
                  type: "object" as "object",
                  properties: {
                    filePattern: {
                      type: "string" as "string",
                      title: "File Pattern",
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
    generalConfiguration: {
      "ui:rootFieldId": "generalConfiguration",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      enabled: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:showLabel": false,
        "ui:data-cy": "enabled-radio-box",
      },
      repositoryInfo: {
        "ui:field": "moveRepoField",
        "ui:disabled": !!useRepoSettings,
        options: { useRepoSettings },
      },
      branch: {
        ...placeholderIf(repoData?.branch),
      },
      other: {
        displayName: {
          "ui:data-cy": "display-name-input",
        },
        batchTime: {
          "ui:description":
            "The interval of time (in minutes) that Evergreen should wait in between activating the latest version.",
          ...placeholderIf(repoData?.batchTime),
        },
        remotePath: {
          ...placeholderIf(repoData?.remotePath),
        },
        spawnHostScriptPath: {
          "ui:description":
            "This is the bash setup script to optionally run on spawn hosts created from tasks.",
          "ui:data-cy": "spawn-host-input",
          ...placeholderIf(repoData?.spawnHostScriptPath),
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
            ? `Default to Repo (${repoData.defaultLogger})`
            : "Select Default Logger",
          ...(!repoData && {
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
        filesIgnoredFromCache: {
          "ui:buttonText": "Add File Pattern",
          "ui:field": "filesIgnoredFromCacheField",
          options: { useRepoSettings },
        },
      },
    },
  },
});
