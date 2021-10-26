import widgets from "components/SpruceForm/Widgets";
import { MoveRepoField } from "./MoveRepoField";

export const getFormData = (useRepoSettings: boolean) => ({
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
      enabled: {
        "ui:widget": widgets.RadioBoxWidget,
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
});
