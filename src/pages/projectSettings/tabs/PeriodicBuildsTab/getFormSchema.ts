import { Field } from "@rjsf/core";
import { utcToZonedTime } from "date-fns-tz";
import { SpruceFormProps } from "components/SpruceForm";
import widgets from "components/SpruceForm/Widgets";
import { DateTimePicker } from "components/SpruceForm/widgets/DateTimePicker";
import { form, ProjectType } from "../utils";

const { overrideRadioBox } = form;

export const getFormSchema = (
  projectType: ProjectType,
  timezone: { str: string; value: string } = { str: "", value: "" }
): {
  fields: Record<string, Field>;
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  fields: {},
  schema: {
    type: "object" as "object",
    description: "Configure tasks to run at fixed intervals.",
    ...overrideRadioBox(
      "periodicBuilds",
      ["Override Repo Commands", "Default to Repo Commands"],
      {
        type: "array" as "array",
        default: [],
        items: {
          type: "object" as "object",
          properties: {
            intervalHours: {
              type: "number" as "number",
              title: "Interval",
            },
            configFile: {
              type: "string" as "string",
              title: "Config File",
              minLength: 1,
              default: "",
            },
            alias: {
              type: "string" as "string",
              title: "Alias",
              default: "",
            },
            message: {
              type: "string" as "string",
              title: "Message",
              default: "",
            },
            timezone: {
              type: "string" as "string",
              title: "Time Zone",
              default: timezone.value,
              oneOf: [
                {
                  type: "string" as "string",
                  title: timezone.str,
                  enum: [timezone.value],
                },
              ],
            },
            nextRunTime: {
              type: "string" as "string",
              title: "Next Run Time",
              default: utcToZonedTime(new Date(), timezone.value).toString(),
            },
          },
        },
      }
    ),
  },
  uiSchema: {
    periodicBuildsOverride: {
      "ui:widget":
        projectType === ProjectType.AttachedProject
          ? widgets.RadioBoxWidget
          : "hidden",
      "ui:showLabel": false,
    },
    periodicBuilds: {
      "ui:addButtonText": "Add Periodic Build",
      "ui:orderable": false,
      "ui:showLabel": false,
      "ui:useExpandableCard": true,
      items: {
        "ui:displayTitle": "New Periodic Build",
        intervalHours: {
          "ui:description": "Number of hours between runs.",
        },
        configFile: {
          "ui:placeholder": ".evergreen.yml",
        },
        alias: {
          "ui:optional": true,
          "ui:placeholder": "my_task_alias",
        },
        message: {
          "ui:optional": true,
          "ui:placeholder": "A periodic build",
        },
        timezone: {
          "ui:description":
            "Next Run Time is configured using the time zone set in User Preferences.",
          "ui:disabled": true,
        },
        nextRunTime: {
          "ui:timezone": timezone.value,
          "ui:widget": DateTimePicker,
        },
      },
    },
    repoData: {
      "ui:orderable": false,
      "ui:readonly": true,
      periodicBuilds: {
        "ui:showLabel": false,
        "ui:useExpandableCard": true,
        items: {
          nextRunTime: {
            "ui:widget": DateTimePicker,
          },
        },
      },
    },
  },
});
