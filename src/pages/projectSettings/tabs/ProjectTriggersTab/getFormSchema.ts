import { GetFormSchema } from "components/SpruceForm";
import widgets from "components/SpruceForm/Widgets";
import { TaskStatus } from "types/task";
import { ProjectTriggerLevel } from "types/triggers";
import { form, ProjectType } from "../utils";

const { overrideRadioBox } = form;

export const getFormSchema = (
  projectType: ProjectType,
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    description:
      "Configure upstream projects to cause tasks in this project to run.",
    ...overrideRadioBox(
      "triggers",
      ["Override Repo Triggers", "Default to Repo Triggers"],
      {
        type: "array" as "array",
        default: [],
        items: {
          type: "object" as "object",
          properties: {
            project: {
              type: "string" as "string",
              title: "Project",
              default: "",
              minLength: 1,
            },
            configFile: {
              type: "string" as "string",
              title: "Config File",
              default: "",
              minLength: 1,
            },
            level: {
              type: "string" as "string",
              title: "Level",
              default: ProjectTriggerLevel.TASK,
              oneOf: [
                {
                  type: "string" as "string",
                  title: "Task",
                  enum: [ProjectTriggerLevel.TASK],
                },
                {
                  type: "string" as "string",
                  title: "Build",
                  enum: [ProjectTriggerLevel.BUILD],
                },
                {
                  type: "string" as "string",
                  title: "Push",
                  enum: [ProjectTriggerLevel.PUSH],
                },
              ],
            },
            status: {
              type: "string" as "string",
              title: "Status",
              default: "",
              oneOf: [
                {
                  type: "string" as "string",
                  title: "All",
                  enum: [""],
                },
                {
                  type: "string" as "string",
                  title: "Success",
                  enum: [TaskStatus.Succeeded],
                },
                {
                  type: "string" as "string",
                  title: "Failure",
                  enum: [TaskStatus.Failed],
                },
              ],
            },
            dateCutoff: {
              type: ["number", "null"],
              title: "Date Cutoff",
              minimum: 0,
            },
            buildVariantRegex: {
              type: "string" as "string",
              title: "Variant Regex",
              default: "",
            },
            taskRegex: {
              type: "string" as "string",
              title: "Task Regex",
              default: "",
            },
            alias: {
              type: "string" as "string",
              title: "Alias",
              default: "",
            },
            unscheduleDownstreamVersions: {
              type: "boolean" as "boolean",
              title: "Unschedule Downstream Versions",
            },
          },
        },
      },
    ),
  },
  uiSchema: {
    triggersOverride: {
      "ui:widget":
        projectType === ProjectType.AttachedProject
          ? widgets.RadioBoxWidget
          : "hidden",
      "ui:showLabel": false,
    },
    triggers: {
      "ui:addButtonText": "Add Project Trigger",
      "ui:orderable": false,
      "ui:showLabel": false,
      "ui:useExpandableCard": true,
      items: {
        "ui:displayTitle": "New Project Trigger",
        "ui:label": false,
        project: {
          "ui:data-cy": "project-input",
        },
        configFile: {
          "ui:data-cy": "config-file-input",
          "ui:placeholder": ".evergreen.yml",
        },
        level: {
          "ui:allowDeselect": false,
        },
        status: {
          "ui:allowDeselect": false,
        },
        dateCutoff: {
          "ui:description":
            "Commits older than this number of days will not invoke trigger.",
          "ui:optional": true,
        },
        buildVariantRegex: {
          "ui:description":
            "Only matching variants in the upstream project will invoke trigger.",
          "ui:optional": true,
        },
        taskRegex: {
          "ui:description":
            "Only matching tasks in the upstream project will invoke trigger.",
          "ui:optional": true,
        },
        alias: {
          "ui:description":
            "Patch alias to filter variants/tasks in this project.",
          "ui:optional": true,
        },
        unscheduleDownstreamVersions: {
          "ui:description":
            "Downstream versions created by this trigger will be deactivated by default",
          "ui:optional": true,
          "ui:bold": true,
        },
      },
    },
    repoData: {
      "ui:orderable": false,
      "ui:readonly": true,
      triggers: {
        "ui:showLabel": false,
        "ui:useExpandableCard": true,
      },
    },
  },
});
