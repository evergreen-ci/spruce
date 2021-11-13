import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import widgets from "components/SpruceForm/Widgets";
import { Project, RepoGeneralSettingsFragment } from "gql/generated/types";
import { placeholderIf, radioBoxOptions } from "../utils";
import { FilesIgnoredFromCacheField } from "./FilesIgnoredFromCacheField";
import { MoveRepoField } from "./MoveRepoField";
import { RepotrackerField } from "./RepotrackerField";

export const getFormData = (
  projectId: string,
  useRepoSettings: boolean,
  validDefaultLoggers: Project["validDefaultLoggers"],
  repoData?: RepoGeneralSettingsFragment
): Record<
  string,
  {
    fields: Record<string, Field>;
    schema: SpruceFormProps["schema"];
    uiSchema: SpruceFormProps["uiSchema"];
  }
> => ({
  generalConfiguration: {
    fields: { moveRepoField: MoveRepoField },
    schema: {
      type: "object" as "object",
      properties: {
        enabled: {
          type: "boolean" as "boolean",
          oneOf: radioBoxOptions(["Enabled", "Disabled"], repoData?.enabled),
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
              type: "boolean" as "boolean",
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
              type: "boolean" as "boolean",
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
              type: "string" as "string",
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
              type: "string" as "string",
              title: "Project Config Commands",
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.taskSync.configEnabled
              ),
            },
            patchEnabled: {
              type: "string" as "string",
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
          "ui:buttonText": "Add File Pattern",
          "ui:field": "filesIgnoredFromCacheField",
          options: { useRepoSettings },
        },
      },
    },
  },
});
