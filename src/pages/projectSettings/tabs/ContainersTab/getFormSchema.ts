import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { GetFormSchema } from "../types";
import { ContainerSizeRow } from "./ContainerSizeRow";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      containerSizeDefinitions: {
        title: "",
        type: "object" as "object",
        properties: {
          variables: {
            type: "array" as "array",
            title: "Container Sizes",
            items: {
              type: "object" as "object",
              properties: {
                name: {
                  type: "string" as "string",
                  title: "Name",
                  default: "",
                  minLength: 1,
                },
                memoryMb: {
                  type: "number" as "number",
                  title: "Memory (MB)",
                  minLength: 1,
                },
                cpu: {
                  type: "number" as "number",
                  title: "CPU",
                  minLength: 1,
                },
              },
            },
          },
        },
      },
      containerCredentials: {
        type: "object" as "object",
        title: "",
        properties: {
          variables: {
            title: "Container Credentials",
            type: "array" as "array",
            items: {
              type: "object" as "object",
              properties: {
                varName: {
                  type: "string" as "string",
                  title: "Name",
                  default: "",
                  minLength: 1,
                },
                varUsername: {
                  type: "string" as "string",
                  title: "Username",
                  minLength: 1,
                },
                varPassword: {
                  type: "string" as "string",
                  title: "Password",
                  minLength: 1,
                },
              },
            },
          },
        },
      },
    },
  },
  uiSchema: {
    containerSizeDefinitions: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      variables: {
        "ui:description": `Specify custom computing resource configurations for running tasks in containers. Memory field denotes the memory (in MB) that will be allocated, and CPU field denotes the number of CPU units that will be allocated. 1024 CPU units is the equivalent of 1vCPU.`,
        "ui:fullWidth": true,
        "ui:orderable": false,
        items: {
          "ui:ObjectFieldTemplate": ContainerSizeRow,
          name: {
            "ui:data-cy": "var-name-input",
          },
          memoryMb: {
            "ui:data-cy": "var-memory-input",
          },
          cpu: {
            "ui:data-cy": "var-cpu-input",
          },
        },
      },
    },
    containerCredentials: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      variables: {
        "ui:description":
          "Set credentials to be used for authentication when interacting with private image repositories.",
        "ui:fullWidth": true,
        items: {
          "ui:ObjectFieldTemplate": ContainerSizeRow,
          varName: {
            "ui:data-cy": "var-name-input",
          },

          varUsername: {
            "ui:data-cy": "var-username-input",
          },
          varPassword: {
            "ui:data-cy": "var-password-input",
          },
        },
      },
    },
  },
});
