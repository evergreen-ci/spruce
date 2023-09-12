import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { ProjectHealthView } from "gql/generated/types";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      view: {
        title: "Project Health View",
        type: "object" as "object",
        description:
          "This setting will define the default behavior of the Project Health page for all viewers of this project. Users can still toggle between views.",
        properties: {
          projectHealthView: {
            type: "string" as "string",
            oneOf: [
              {
                type: "string" as "string",
                title: "Default view",
                enum: [ProjectHealthView.Failed],
                description:
                  "Displays only task failures, making it easier to identify them, and groups tasks by status if they don't match any search criteria. Consider using it for troubleshooting specific issues.",
              },
              {
                type: "string" as "string",
                title: "All tasks view",
                enum: [ProjectHealthView.All],
                description:
                  "Displays all tasks without grouping. This view can be helpful for getting a comprehensive overview of all tasks.",
              },
            ],
          },
        },
      },
      parsleyFiltersTitle: {
        type: "null",
        title: "Parsley Filters",
      },
      parsleyFilters: {
        title: "",
        type: "array" as "array",
        default: [],
        items: {
          type: "object" as "object",
          properties: {
            expression: {
              type: "string" as "string",
              title: "Filter Expression",
              default: "",
              minLength: 1,
              format: "validRegex",
            },
            caseSensitive: {
              type: "boolean" as "boolean",
              title: "Case",
              default: false,
              oneOf: [
                {
                  type: "boolean" as "boolean",
                  title: "Insensitive",
                  enum: [false],
                },
                {
                  type: "boolean" as "boolean",
                  title: "Sensitive",
                  enum: [true],
                },
              ],
            },
            exactMatch: {
              type: "boolean" as "boolean",
              title: "Match",
              default: true,
              oneOf: [
                {
                  type: "boolean" as "boolean",
                  title: "Exact",
                  enum: [true],
                },
                {
                  type: "boolean" as "boolean",
                  title: "Inverse",
                  enum: [false],
                },
              ],
            },
          },
        },
      },
    },
  },
  uiSchema: {
    view: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      projectHealthView: {
        "ui:widget": "radio",
      },
    },
    parsleyFiltersTitle: {
      "ui:sectionTitle": true,
    },
    parsleyFilters: {
      "ui:addButtonText": "Add filter",
      "ui:orderable": false,
      "ui:description":
        "These filters will be available by default in the Parsley log viewer for any logs generated by this project.",
      "ui:useExpandableCard": true,
      "ui:data-cy": "parsley-filter-list",
      items: {
        "ui:displayTitle": "New Parsley Filter",
        "ui:label": false,
        expression: {
          "ui:data-cy": "parsley-filter-expression",
        },
        caseSensitive: {
          "ui:widget": widgets.SegmentedControlWidget,
          "ui:aria-controls": ["case-insensitive", "case-sensitive"],
          "ui:data-cy": "parsley-filter-case-sensitivity",
          "ui:sizeVariant": "xsmall",
        },
        exactMatch: {
          "ui:widget": widgets.SegmentedControlWidget,
          "ui:aria-controls": ["exact-match", "inverse-match"],
          "ui:data-cy": "parsley-filter-match-type",
          "ui:sizeVariant": "xsmall",
        },
      },
    },
  },
});
