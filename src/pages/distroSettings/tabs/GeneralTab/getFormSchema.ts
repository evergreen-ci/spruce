import { css } from "@emotion/react";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      distroName: {
        type: "object" as "object",
        title: "",
        properties: {
          identifier: {
            type: "string" as "string",
            title: "Identifier",
            readOnly: true,
          },
        },
      },
      distroAliases: {
        type: "object" as "object",
        title: "Aliases",
        properties: {
          aliases: {
            type: "array" as "array",
            items: {
              type: "string" as "string",
              title: "Alias",
              default: "",
              minLength: 1,
            },
          },
        },
      },
      distroNote: {
        type: "object" as "object",
        title: "Notes",
        properties: {
          note: {
            type: "string" as "string",
            title: "Notes",
            default: "",
          },
        },
      },
      distroOptions: {
        type: "object" as "object",
        title: "Distro Options",
        properties: {
          isCluster: {
            type: "boolean" as "boolean",
            title:
              "Mark distro as a cluster (jobs are not run on this host, used for special purposes).",
            default: false,
          },
          disableShallowClone: {
            type: "boolean" as "boolean",
            title: "Disable shallow clone for this distro.",
            default: false,
          },
          disabled: {
            type: "boolean" as "boolean",
            title: "Disable queueing this distro.",
            default: false,
          },
        },
      },
    },
  },
  uiSchema: {
    distroName: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
    },
    distroAliases: {
      "ui:rootFieldId": "aliases",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      aliases: {
        "ui:addButtonText": "Add alias",
        "ui:orderable": false,
        "ui:showLabel": false,
        items: {
          "ui:label": false,
        },
      },
    },
    distroNote: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      note: {
        "ui:widget": "textarea",
        "ui:elementWrapperCSS": textAreaCSS,
      },
    },
    distroOptions: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      disabled: {
        "ui:description": "Tasks already in the task queue will be removed.",
      },
    },
  },
});

const textAreaCSS = css`
  box-sizing: border-box;
  textarea {
    min-height: 150px;
  }
`;
