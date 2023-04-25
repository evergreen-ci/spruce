import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { SpruceConfig } from "gql/generated/types";
import { GetFormSchema } from "../types";
import { ContainerSizeRow } from "./ContainerSizeRow";

export const getFormSchema = (
  ecsConfig: SpruceConfig["providers"]["aws"]["pod"]["ecs"]
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      containerSizeDefinitions: {
        title: "Container Configurations",
        type: "object" as "object",
        properties: {
          variables: {
            type: "array" as "array",
            title: "",
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
                  minimum: 1,
                  maximum: ecsConfig.maxMemoryMb,
                },
                cpu: {
                  type: "number" as "number",
                  title: "CPU",
                  minLength: 1,
                  minimum: 1,
                  maximum: ecsConfig.maxCPU,
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
        "ui:addButtonText": "Add new configuration",
        items: {
          "ui:ObjectFieldTemplate": ContainerSizeRow,
          "ui:data-cy": "container-size-row",
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
  },
});
