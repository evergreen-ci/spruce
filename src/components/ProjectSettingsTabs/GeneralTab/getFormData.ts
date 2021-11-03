import widgets from "components/SpruceForm/Widgets";
import { Project } from "gql/generated/types";
import { ForceRepotrackerRunField } from "./ForceRepotrackerRunField";
import { MoveRepoField } from "./MoveRepoField";

export const getFormData = (
  projectId: string,
  useRepoSettings: boolean,
  validDefaultLoggers: Project["validDefaultLoggers"]
) => ({
  generalConfiguration: {
    fields: { moveRepo: MoveRepoField },
    schema: {
      type: "object" as "object",
      properties: {
        enabled: {
          type: "string" as "string",
          enum: ["enabled", "disabled"],
          enumNames: ["Enabled", "Disabled"],
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
        "ui:field": "moveRepo",
        "ui:disabled": true,
        options: { useRepoSettings },
      },
      other: {
        batchTime: {
          "ui:description":
            "The interval of time (in minutes) that Evergreen should wait in between activating the latest version.",
          "ui:emptyValue": 9,
        },
        spawnHostScriptPath: {
          "ui:description":
            "This is the bash setup script to optionally run on spawn hosts created from tasks.",
          "ui:data-cy": "spawn-host-input",
        },
      },
    },
  },
  projectFlags: {
    fields: { forceRepotrackerRun: ForceRepotrackerRunField },
    schema: {
      type: "object" as "object",
      properties: {
        dispatchingDisabled: {
          type: "string" as "string",
          title: "Dispatching",
          enum: ["enabled", "disabled"],
          enumNames: ["Enabled", "Disabled"],
        },
        scheduling: {
          type: "object" as "object",
          title: "Scheduling Settings",
          properties: {
            deactivatePrevious: {
              type: "string" as "string",
              title: "Old task on success",
              enum: ["unschedule", "schedule"],
              enumNames: ["Unschedule", "Schedule"],
            },
          },
        },
        repotracker: {
          type: "object" as "object",
          title: "Repotracker Settings",
          properties: {
            repotrackerDisabled: {
              type: "string" as "string",
              title: "Repotracker",
              enum: ["enabled", "disabled"],
              enumNames: ["Enabled", "Disabled"],
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
              type: "string" as "string",
              title: "Cedar Test Results",
              enum: ["enabled", "disabled"],
              enumNames: ["Enabled", "Disabled"],
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
              enum: ["enabled", "disabled"],
              enumNames: ["Enabled", "Disabled"],
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
              enum: ["enabled", "disabled"],
              enumNames: ["Enabled", "Disabled"],
            },
            patchEnabled: {
              type: "string" as "string",
              title: "Task in Patches",
              enum: ["enabled", "disabled"],
              enumNames: ["Enabled", "Disabled"],
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
        repotrackerDisabled: {
          "ui:field": "forceRepotrackerRun",
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "Repotracker will be triggered from GitHub push events sent via webhook.",
          options: { projectId },
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
    fields: {},
    schema: {
      type: "object" as "object",
      properties: {
        disabledStatsCache: {
          type: "string" as "string",
          title: "Caching",
          enum: ["enabled", "disabled"],
          enumNames: ["Enabled", "Disabled"],
        },
        filesIgnoredFromCache: {
          title: "File Patterns to Ignore",
          type: "array" as "array",
          description:
            "Comma-separated list of regular expression patterns that specify test filenames to ignore when caching test and task history.",
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
    uiSchema: {
      disabledStatsCache: {
        "ui:widget": widgets.RadioBoxWidget,
      },
    },
  },
});
