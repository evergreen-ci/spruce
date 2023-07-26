import { GetFormSchema } from "components/SpruceForm";
import {
  CardFieldTemplate,
  FieldRow,
} from "components/SpruceForm/FieldTemplates";
import { SpruceConfig } from "gql/generated/types";

export const getFormSchema = (
  ecsConfig: SpruceConfig["providers"]["aws"]["pod"]["ecs"]
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    properties: {
      containerSizeDefinitions: {
        properties: {
          variables: {
            items: {
              properties: {
                cpu: {
                  default: 1,
                  maximum: ecsConfig?.maxCPU || 1024,
                  minimum: 1,
                  title: "CPU",
                  type: "number" as "number",
                },
                memoryMb: {
                  default: 100,
                  maximum: ecsConfig?.maxMemoryMb || 1024,
                  minimum: 1,
                  title: "Memory (MB)",
                  type: "number" as "number",
                },
                name: {
                  default: "",
                  minLength: 1,
                  title: "Name",
                  type: "string" as "string",
                },
              },
              required: ["memoryMb", "cpu"],
              type: "object" as "object",
            },
            title: "",
            type: "array" as "array",
          },
        },
        title: "Container Configurations",
        type: "object" as "object",
      },
    },
    type: "object" as "object",
  },
  uiSchema: {
    containerSizeDefinitions: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      variables: {
        items: {
          cpu: {
            "ui:data-cy": "var-cpu-input",
          },
          memoryMb: {
            "ui:data-cy": "var-memory-input",
          },
          name: {
            "ui:data-cy": "var-name-input",
          },
          "ui:ObjectFieldTemplate": FieldRow,
          "ui:data-cy": "container-size-row",
        },
        "ui:addButtonText": "Add new configuration",
        "ui:description": `Specify custom computing resource configurations for running tasks in containers. The Memory field denotes the memory (in MB) that will be allocated, and the CPU field denotes the number of CPU units that will be allocated. 1024 CPU units is the equivalent of 1vCPU.`,
        "ui:fullWidth": true,
        "ui:orderable": false,
      },
    },
  },
});
