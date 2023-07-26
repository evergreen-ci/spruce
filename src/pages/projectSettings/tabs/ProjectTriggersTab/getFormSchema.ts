import { GetFormSchema } from "components/SpruceForm";
import widgets from "components/SpruceForm/Widgets";
import { TaskStatus } from "types/task";
import { ProjectTriggerLevel } from "types/triggers";
import { form, ProjectType } from "../utils";

const { overrideRadioBox } = form;

export const getFormSchema = (
  projectType: ProjectType
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    description:
      "Configure upstream projects to cause tasks in this project to run.",
    type: "object" as "object",
    ...overrideRadioBox(
      "triggers",
      ["Override Repo Triggers", "Default to Repo Triggers"],
      {
        default: [],
        items: {
          properties: {
            alias: {
              default: "",
              title: "Alias",
              type: "string" as "string",
            },
            buildVariantRegex: {
              default: "",
              title: "Variant Regex",
              type: "string" as "string",
            },
            configFile: {
              default: "",
              minLength: 1,
              title: "Config File",
              type: "string" as "string",
            },
            dateCutoff: {
              minimum: 0,
              title: "Date Cutoff",
              type: ["number", "null"],
            },
            level: {
              default: ProjectTriggerLevel.TASK,
              oneOf: [
                {
                  enum: [ProjectTriggerLevel.TASK],
                  title: "Task",
                  type: "string" as "string",
                },
                {
                  enum: [ProjectTriggerLevel.BUILD],
                  title: "Build",
                  type: "string" as "string",
                },
              ],
              title: "Level",
              type: "string" as "string",
            },
            project: {
              default: "",
              minLength: 1,
              title: "Project",
              type: "string" as "string",
            },
            status: {
              default: "",
              oneOf: [
                {
                  enum: [""],
                  title: "All",
                  type: "string" as "string",
                },
                {
                  enum: [TaskStatus.Succeeded],
                  title: "Success",
                  type: "string" as "string",
                },
                {
                  enum: [TaskStatus.Failed],
                  title: "Failure",
                  type: "string" as "string",
                },
              ],
              title: "Status",
              type: "string" as "string",
            },
            taskRegex: {
              default: "",
              title: "Task Regex",
              type: "string" as "string",
            },
          },
          type: "object" as "object",
        },
        type: "array" as "array",
      }
    ),
  },
  uiSchema: {
    repoData: {
      triggers: {
        "ui:showLabel": false,
        "ui:useExpandableCard": true,
      },
      "ui:orderable": false,
      "ui:readonly": true,
    },
    triggers: {
      items: {
        alias: {
          "ui:description":
            "Patch alias to filter variants/tasks in this project.",
          "ui:optional": true,
        },
        buildVariantRegex: {
          "ui:description":
            "Only matching variants in the upstream project will invoke trigger.",
          "ui:optional": true,
        },
        configFile: {
          "ui:data-cy": "config-file-input",
          "ui:placeholder": ".evergreen.yml",
        },
        dateCutoff: {
          "ui:description":
            "Commits older than this number of days will not invoke trigger.",
          "ui:optional": true,
        },
        level: {
          "ui:allowDeselect": false,
        },
        project: {
          "ui:data-cy": "project-input",
        },
        status: {
          "ui:allowDeselect": false,
        },
        taskRegex: {
          "ui:description":
            "Only matching tasks in the upstream project will invoke trigger.",
          "ui:optional": true,
        },
        "ui:displayTitle": "New Project Trigger",
      },
      "ui:addButtonText": "Add Project Trigger",
      "ui:orderable": false,
      "ui:showLabel": false,
      "ui:useExpandableCard": true,
    },
    triggersOverride: {
      "ui:showLabel": false,
      "ui:widget":
        projectType === ProjectType.AttachedProject
          ? widgets.RadioBoxWidget
          : "hidden",
    },
  },
});
