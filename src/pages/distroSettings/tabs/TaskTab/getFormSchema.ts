import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import {
  FinderVersion,
  PlannerVersion,
  DispatcherVersion,
  Provider,
} from "gql/generated/types";

export const getFormSchema = ({
  provider,
}: {
  provider: Provider;
}): ReturnType<GetFormSchema> => {
  const hasEC2Provider =
    provider !== Provider.Static && provider !== Provider.Docker;

  return {
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
          },
          dependencies: {
            version: {
              oneOf: [
                {
                  properties: {
                    version: {
                      enum: [PlannerVersion.Legacy],
                    },
                  },
                },
                {
                  properties: {
                    version: {
                      enum: [PlannerVersion.Tunable],
                    },
                    tunableOptions: {
                      type: "object" as "object",
                      title: "",
                      properties: {
                        targetTime: {
                          type: "number" as "number",
                          title: "Target Time (ms)",
                          default: 0,
                          minimum: 0,
                        },
                        patchFactor: {
                          type: "number" as "number",
                          title: "Patch Factor",
                          default: 0,
                          minimum: 0,
                          maximum: 100,
                        },
                        patchTimeInQueueFactor: {
                          type: "number" as "number",
                          title: "Patch Time in Queue Factor",
                          default: 0,
                          minimum: 0,
                          maximum: 100,
                        },
                        mainlineTimeInQueueFactor: {
                          type: "number" as "number",
                          title: "Mainline Time in Queue Factor",
                          default: 0,
                          minimum: 0,
                          maximum: 100,
                        },
                        commitQueueFactor: {
                          type: "number" as "number",
                          title: "Commit Queue Factor",
                          default: 0,
                          minimum: 0,
                          maximum: 100,
                        },
                        expectedRuntimeFactor: {
                          type: "number" as "number",
                          title: "Expected Runtime Factor",
                          default: 0,
                          minimum: 0,
                          maximum: 100,
                        },
                        generateTaskFactor: {
                          type: "number" as "number",
                          title: "Generate Task Factor",
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
              ],
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
          "ui:field-data-cy": "tunable-options",
          ...(!hasEC2Provider && { "ui:widget": "hidden" }),
          patchFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
          patchTimeInQueueFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
          mainlineTimeInQueueFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
          commitQueueFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
          expectedRuntimeFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
          generateTaskFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
        },
      },
      dispatcherSettings: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        version: {
          "ui:allowDeselect": false,
        },
      },
    },
  };
};
