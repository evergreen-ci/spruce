import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { GetFormSchema } from "../types";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      projectHealthView: {
        title: "Project Health View",
        type: "object" as "object",
      },
      parsleyFilters: {
        title: "Parsley Filters",
        type: "array" as "array",
        default: [],
        items: {
          type: "object" as "object",
          properties: {
            expression: {
              type: "string" as "string",
              title: "Filter Expression",
              minLength: 1,
              default: "",
              format: "validRegex",
            },
            caseSensitive: {
              type: "boolean" as "boolean",
              title: "Case",
              default: true,
              oneOf: [
                {
                  type: "boolean" as "boolean",
                  title: "Insensitive",
                  enum: [true],
                },
                {
                  type: "boolean" as "boolean",
                  title: "Sensitive",
                  enum: [false],
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
    projectHealthView: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
    },
    parsleyFilters: {
      "ui:addButtonText": "Add filter",
      "ui:orderable": false,
      "ui:description":
        "The filters will be available within the Parsley log viewer for any logs generated by this project.",
      "ui:useExpandableCard": true,
      "ui:data-cy": "parsley-filters-list",
      items: {
        "ui:displayTitle": "New Parsley Filter",
        expression: {
          "ui:data-cy": "filter-expression",
        },
        caseSensitive: {
          "ui:widget": widgets.SegmentedControlWidget,
          "ui:sizeVariant": "small",
          "ui:aria-controls": ["case-insensitive", "case-sensitive"],
          "ui:data-cy": "filter-case-sensitivity",
        },
        exactMatch: {
          "ui:widget": widgets.SegmentedControlWidget,
          "ui:sizeVariant": "small",
          "ui:aria-controls": ["exact-match", "inverse-match"],
          "ui:data-cy": "filter-match-type",
        },
      },
    },
  },
});
