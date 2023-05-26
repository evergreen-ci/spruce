import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
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
        type: "object" as "object",
      },
    },
  },
  uiSchema: {
    projectHealthView: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
    },
    parsleyFilters: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
    },
  },
});
