import widgets from "components/SpruceForm/Widgets";
import { Project, RepoGeneralSettingsFragment } from "gql/generated/types";
import { FilesIgnoredFromCacheField } from "./FilesIgnoredFromCacheField";
import { MoveRepoField } from "./MoveRepoField";
import { RepotrackerField } from "./RepotrackerField";

const insertIf = (condition, ...elements) => (condition ? elements : []);

const placeholderIf = (element) =>
  element && { "ui:placeholder": `${element} (Default from repo)` };

export const getFormData = (
  projectId: string,
  useRepoSettings: boolean,
  validDefaultLoggers: Project["validDefaultLoggers"],
  repoData?: RepoGeneralSettingsFragment
) => ({
  generalConfiguration: {
    fields: { moveRepoField: MoveRepoField },
    schema: {
      type: "object" as "object",
      properties: {
        enabled: {
          type: "boolean" as "boolean",
          enum: [true, false, ...insertIf(repoData, null)],
          enumNames: [
            "Enabled",
            "Disabled",
            ...insertIf(
              repoData,
              `Default to repo (${repoData?.enabled ? "enabled" : "disabled"})`
            ),
          ],
        },
        repositoryInfo: {
          type: "object" as "object",
          title: "Repository Info",
          properties: {
            owner: {
              type: "string" as "string",
              title: "Owner",
            },
            repo: {
              type: "string" as "string",
              title: "Repository",
            },
          },
        },
        branch: {
          type: "string" as "string",
          title: "Branch Name",
        },
        other: {
          type: "object" as "object",
          title: "Other",
          properties: {
            displayName: {
              type: "string" as "string",
              title: "Display Name",
            },
            batchTime: {
              type: "number" as "number",
              title: "Batch Time",
            },
            remotePath: {
              type: "string" as "string",
              title: "Config File",
            },
            spawnHostScriptPath: {
              type: "string" as "string",
              title: "Spawn Host Script Path",
            },
          },
        },
      },
    },
    uiSchema: {
      "ui:rootFieldId": "generalConfiguration",
      enabled: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:showLabel": false,
      },
      repositoryInfo: {
        "ui:field": "moveRepoField",
        "ui:disabled": true,
        options: { useRepoSettings },
      },
      branch: {
        ...placeholderIf(repoData?.branch),
      },
      other: {
        batchTime: {
          "ui:description":
            "The interval of time (in minutes) that Evergreen should wait in between activating the latest version.",
          "ui:emptyValue": 9,
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
  },
  projectFlags: {
    fields: { repotrackerField: RepotrackerField },
    schema: {
      type: "object" as "object",
      properties: {
        dispatchingDisabled: {
          type: "boolean" as "boolean",
          title: "Dispatching",
          enum: [false, true, ...insertIf(repoData, null)],
          enumNames: [
            "Enabled",
            "Disabled",
            ...insertIf(
              repoData,
              `Default to repo (${
                repoData?.dispatchingDisabled ? "disabled" : "enabled"
              })`
            ),
          ],
        },
        scheduling: {
          type: "object" as "object",
          title: "Scheduling Settings",
          properties: {
            deactivatePrevious: {
              type: "boolean" as "boolean",
              title: "Old task on success",
              enum: [true, false, ...insertIf(repoData, null)],
              enumNames: [
                "Unschedule",
                "Schedule",
                ...insertIf(
                  repoData,
                  `Default to repo (${
                    repoData?.deactivatePrevious ? "unscheduled" : "scheduled"
                  })`
                ),
              ],
            },
          },
        },
        repotracker: {
          type: "object" as "object",
          title: "Repotracker Settings",
          properties: {
            repotrackerDisabled: {
              type: "boolean" as "boolean",
              title: "Repotracker",
              enum: [false, true, ...insertIf(repoData, null)],
              enumNames: [
                "Enabled",
                "Disabled",
                ...insertIf(
                  repoData,
                  `Default to repo (${
                    repoData?.repotrackerDisabled ? "disabled" : "enabled"
                  })`
                ),
              ],
            },
          },
        },
        logger: {
          type: "object" as "object",
          title: "Default Logger",
          properties: {
            defaultLogger: {
              type: "string" as "string",
              enum: validDefaultLoggers,
            },
          },
        },
        testResults: {
          type: "object" as "object",
          title: "Test Results",
          properties: {
            cedarTestResultsEnabled: {
              type: "boolean" as "string",
              title: "Cedar Test Results",
              enum: [true, false, ...insertIf(repoData, null)],
              enumNames: [
                "Enabled",
                "Disabled",
                ...insertIf(
                  repoData,
                  `Default to repo (${
                    repoData?.cedarTestResultsEnabled ? "enabled" : "disabled"
                  })`
                ),
              ],
            },
          },
        },
        patch: {
          type: "object" as "object",
          title: "Patch Settings",
          properties: {
            patchingDisabled: {
              type: "string" as "string",
              title: "Patching",
              enum: [true, false, ...insertIf(repoData, null)],
              enumNames: [
                "Enabled",
                "Disabled",
                ...insertIf(
                  repoData,
                  `Default to repo (${
                    repoData?.patchingDisabled ? "enabled" : "disabled"
                  })`
                ),
              ],
            },
          },
        },
        taskSync: {
          type: "object" as "object",
          title: "Task Sync",
          properties: {
            configEnabled: {
              type: "string" as "string",
              title: "Project Config Commands",
              enum: [true, false, ...insertIf(repoData, null)],
              enumNames: [
                "Enabled",
                "Disabled",
                ...insertIf(
                  repoData,
                  `Default to repo (${
                    repoData?.taskSync.configEnabled ? "enabled" : "disabled"
                  })`
                ),
              ],
            },
            patchEnabled: {
              type: "string" as "string",
              title: "Task in Patches",
              enum: [true, false, ...insertIf(repoData, null)],
              enumNames: [
                "Enabled",
                "Disabled",
                ...insertIf(
                  repoData,
                  `Default to repo (${
                    repoData?.taskSync.patchEnabled ? "enabled" : "disabled"
                  })`
                ),
              ],
            },
          },
        },
      },
    },
    uiSchema: {
      "ui:rootFieldId": "projectFlags",
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
          "ui:placeholder": "Select Default Logger",
          "ui:allowDeselect": false,
          "ui:ariaLabelledBy": "projectFlags_logger__title",
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
  },
  historicalDataCaching: {
    fields: {
      filesIgnoredFromCacheField: FilesIgnoredFromCacheField,
    },
    schema: {
      type: "object" as "object",
      properties: {
        disabledStatsCache: {
          type: "string" as "string",
          title: "Caching",
          enum: [true, false, ...insertIf(repoData, null)],
          enumNames: [
            "Enabled",
            "Disabled",
            ...insertIf(
              repoData,
              `Default to repo (${
                repoData?.disabledStatsCache ? "enabled" : "disabled"
              })`
            ),
          ],
        },
        files: {
          type: "object" as "object",
          title: "File Patterns to Ignore",
          description:
            "Comma-separated list of regular expression patterns that specify test filenames to ignore when caching test and task history.",
          properties: {
            filesIgnoredFromCache: {
              type: "array" as "array",
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
    uiSchema: {
      "ui:rootFieldId": "historicalDataCaching",
      disabledStatsCache: {
        "ui:widget": widgets.RadioBoxWidget,
      },
      files: {
        filesIgnoredFromCache: {
          "ui:field": "filesIgnoredFromCacheField",
          options: { useRepoSettings },
        },
      },
    },
  },
});
