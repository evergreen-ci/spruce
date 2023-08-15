import { GetFormSchema } from "components/SpruceForm";
import {
  CardFieldTemplate,
  FieldRow,
} from "components/SpruceForm/FieldTemplates";
import { CloneMethod } from "gql/generated/types";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      cloneMethod: {
        type: "string" as "string",
        title: "Project Cloning Method",
        oneOf: [
          {
            type: "string" as "string",
            title: "Legacy SSH",
            enum: [CloneMethod.LegacySsh],
          },
          {
            type: "string" as "string",
            title: "OAuth",
            enum: [CloneMethod.Oauth],
          },
        ],
      },
      expansions: {
        type: "array" as "array",
        title: "Expansions",
        items: {
          type: "object" as "object",
          properties: {
            key: {
              type: "string" as "string",
              title: "Key",
              default: "",
              minLength: 1,
            },
            value: {
              type: "string" as "string",
              title: "Value",
              default: "",
              minLength: 1,
            },
          },
        },
      },
      validProjects: {
        type: "array" as "array",
        title: "Valid Projects",
        items: {
          type: "string" as "string",
          title: "Project Name",
          default: "",
          minLength: 1,
        },
      },
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    cloneMethod: {
      "ui:allowDeselect": false,
      "ui:data-cy": "clone-method-select",
    },
    expansions: {
      "ui:addButtonText": "Add expansion",
      "ui:orderable": false,
      items: {
        "ui:ObjectFieldTemplate": FieldRow,
        "ui:label": false,
      },
    },
    validProjects: {
      "ui:addButtonText": "Add project",
      "ui:orderable": false,
      items: {
        "ui:label": false,
      },
    },
  },
});
