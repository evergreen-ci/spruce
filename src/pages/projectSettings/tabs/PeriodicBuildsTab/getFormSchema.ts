import { GetFormSchema } from "components/SpruceForm";
import widgets from "components/SpruceForm/Widgets";
import { timeZones } from "constants/fieldMaps";
import { form, ProjectType } from "../utils";
import { IntervalSpecifier } from "./types";

const { overrideRadioBox } = form;

export const getFormSchema = (
  projectType: ProjectType,
  timezone: string
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    description:
      "Configure tasks to run at a consistent interval within this project. " +
      "This will create a new version that can be seen on the Spruce commits page, " +
      "regardless of whether or not a new commit has been pushed since the last interval, " +
      "as opposed to batchtime which will activate the tasks on existing commit versions.",
    type: "object" as "object",
    ...overrideRadioBox(
      "periodicBuilds",
      ["Override Repo Commands", "Default to Repo Commands"],
      {
        default: [],
        items: {
          properties: {
            alias: {
              default: "",
              title: "Alias",
              type: "string" as "string",
            },
            configFile: {
              default: "",
              minLength: 1,
              title: "Config File",
              type: "string" as "string",
            },
            interval: {
              dependencies: {
                specifier: {
                  oneOf: [
                    {
                      properties: {
                        intervalHours: {
                          default: 24,
                          minimum: 1,
                          title: "Interval",
                          type: "number" as "number",
                        },
                        specifier: {
                          enum: [IntervalSpecifier.Hours],
                        },
                      },
                    },
                    {
                      properties: {
                        cron: {
                          title: "Cron Expression",
                          type: "string" as "string",
                        },
                        specifier: {
                          enum: [IntervalSpecifier.Cron],
                        },
                      },
                    },
                  ],
                },
              },
              properties: {
                specifier: {
                  default: IntervalSpecifier.Hours,
                  oneOf: [
                    {
                      enum: [IntervalSpecifier.Hours],
                      title: "Hours",
                      type: "string" as "string",
                    },
                    {
                      enum: [IntervalSpecifier.Cron],
                      title: "Cron",
                      type: "string" as "string",
                    },
                  ],
                  title: "",
                  type: "string" as "string",
                },
              },
              title: "Interval Specifier",
              type: "object" as "object",
            },
            message: {
              default: "",
              title: "Message",
              type: "string" as "string",
            },
            nextRunTime: {
              default: new Date().toString(),
              title: "Next Run Time",
              type: "string" as "string",
            },
            timezone: {
              default: timezone,
              oneOf: [
                ...timeZones.map(({ str, value }) => ({
                  enum: [value],
                  title: str,
                  type: "string" as "string",
                })),
                {
                  enum: [""],
                  title: "Local Time",
                  type: "string" as "string",
                },
              ],
              title: "Time Zone",
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
    periodicBuilds: {
      items: {
        alias: {
          "ui:optional": true,
          "ui:placeholder": "my_task_alias",
        },
        configFile: {
          "ui:data-cy": "config-file-input",
          "ui:placeholder": ".evergreen.yml",
        },
        interval: {
          intervalHours: {
            "ui:data-cy": "interval-input",
            "ui:description": "Number of hours between runs.",
          },
          specifier: {
            "ui:widget": widgets.SegmentedControlWidget,
          },
        },
        message: {
          "ui:optional": true,
          "ui:placeholder": "A periodic build",
        },
        nextRunTime: {
          "ui:disableBefore": new Date(),
          "ui:widget": "date-time",
        },
        timezone: {
          "ui:description":
            "Next Run Time is configured using the time zone set in User Preferences.",
          "ui:disabled": true,
        },
        "ui:displayTitle": "New Periodic Build",
      },
      "ui:addButtonText": "Add Periodic Build",
      "ui:orderable": false,
      "ui:showLabel": false,
      "ui:useExpandableCard": true,
    },
    periodicBuildsOverride: {
      "ui:showLabel": false,
      "ui:widget":
        projectType === ProjectType.AttachedProject
          ? widgets.RadioBoxWidget
          : "hidden",
    },
    repoData: {
      periodicBuilds: {
        items: {
          nextRunTime: {
            "ui:widget": "date-time",
          },
        },
        "ui:showLabel": false,
        "ui:useExpandableCard": true,
      },
      "ui:orderable": false,
      "ui:readonly": true,
    },
  },
});
