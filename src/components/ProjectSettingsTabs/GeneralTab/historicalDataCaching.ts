import widgets from "components/SpruceForm/Widgets";

export const historicalDataCaching = {
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
};
