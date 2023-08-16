import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import {
  FinderVersion,
  PlannerVersion,
  DispatcherVersion,
} from "gql/generated/types";

export const getFormSchema = ({
  plannerVersion,
}: {
  plannerVersion: string;
}): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      finderSettings: {
        type: "object" as "object",
        title: "Task Finder",
        properties: {
          version: {
            type: "string" as "string",
            title: "Task Finder Version",
            oneOf: [
              {
                type: "string" as "string",
                title: "Legacy",
                enum: [FinderVersion.Legacy],
              },
              {
                type: "string" as "string",
                title: "Parallel",
                enum: [FinderVersion.Parallel],
              },
              {
                type: "string" as "string",
                title: "Pipeline",
                enum: [FinderVersion.Pipeline],
              },
              {
                type: "string" as "string",
                title: "Alternate",
                enum: [FinderVersion.Alternate],
              },
            ],
          },
        },
      },
      plannerSettings: {
        type: "object" as "object",
        title: "Task Planner",
        properties: {
          version: {
            type: "string" as "string",
            title: "Task Planner Version",
            oneOf: [
              {
                type: "string" as "string",
                title: "Legacy",
                enum: [PlannerVersion.Legacy],
              },
              {
                type: "string" as "string",
                title: "Tunable",
                enum: [PlannerVersion.Tunable],
              },
            ],
          },
          tunableOptions: {
            type: "object" as "object",
            title: "",
            properties: {
              targetTime: {
                type: "number" as "number",
                title: "Target Time (seconds)",
                default: 0,
                minimum: 0,
                maximum: 100,
              },
              patchFactor: {
                type: "number" as "number",
                title: "Patch Factor (0 to 100 inclusive)",
                default: 0,
                minimum: 0,
                maximum: 100,
              },
              patchTimeInQueueFactor: {
                type: "number" as "number",
                title: "Patch Time in Queue Factor (0 to 100 inclusive)",
                default: 0,
                minimum: 0,
                maximum: 100,
              },
              mainlineTimeInQueueFactor: {
                type: "number" as "number",
                title: "Mainline Time in Queue Factor (0 to 100 inclusive)",
                default: 0,
                minimum: 0,
                maximum: 100,
              },
              commitQueueFactor: {
                type: "number" as "number",
                title: "Commit Queue Factor (0 to 100 inclusive)",
                default: 0,
                minimum: 0,
                maximum: 100,
              },
              expectedRuntimeFactor: {
                type: "number" as "number",
                title: "Expected Runtime Factor (0 to 100 inclusive)",
                default: 0,
                minimum: 0,
                maximum: 100,
              },
              generateTaskFactor: {
                type: "number" as "number",
                title: "Generate Task Factor (0 to 100 inclusive)",
                default: 0,
                minimum: 0,
                maximum: 100,
              },
              groupVersions: {
                type: "boolean" as "boolean",
                title: "Group versions",
                default: false,
              },
            },
          },
        },
      },
      dispatcherSettings: {
        type: "object" as "object",
        title: "Task Dispatcher",
        properties: {
          version: {
            type: "string" as "string",
            title: "Task Dispatcher Version",
            oneOf: [
              {
                type: "string" as "string",
                title: "Revised",
                enum: [DispatcherVersion.Revised],
              },
              {
                type: "string" as "string",
                title: "Revised with dependencies",
                enum: [DispatcherVersion.RevisedWithDependencies],
              },
            ],
          },
        },
      },
    },
  },
  uiSchema: {
    finderSettings: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      version: {
        "ui:allowDeselect": false,
      },
    },
    plannerSettings: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      version: {
        "ui:allowDeselect": false,
      },
      tunableOptions: {
        "ui:data-cy": "tunable-options",
        // Options are only available if the planner version is tunable.
        ...(plannerVersion === PlannerVersion.Legacy && {
          "ui:widget": "hidden",
        }),
      },
    },
    dispatcherSettings: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      version: {
        "ui:allowDeselect": false,
      },
    },
  },
});
