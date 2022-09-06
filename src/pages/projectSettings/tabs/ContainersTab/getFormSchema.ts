import widgets from "components/SpruceForm/Widgets";
import { GetFormSchema } from "../types";
import { form, ProjectType } from "../utils";

const { overrideRadioBox } = form;

export const getFormSchema = (
  projectType: ProjectType
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    description:
      "Specify custom computing resource configurations for running tasks in containers. Memory field denotes the memory (in MB) that the container will be allocated, and CPU is the CPU units that will be allocated. 1024 CPU units is equivalent to 1vCPU.",
    ...overrideRadioBox(
      "containerSizeDefinitions",
      ["Override Repo Definitions", "Default to Repo Definitions"],
      {
        type: "array" as "array",
        default: [],
        items: {
          required: ["name"],
          type: "object" as "object",
          properties: {
            name: {
              type: "string" as "string",
              title: "Name",
              default: "",
            },
            memoryMb: {
              type: "number" as "number",
              title: "Memory MB",
            },
            cpu: {
              type: "number" as "number",
              title: "CPU",
            },
          },
        },
      }
    ),
  },
  uiSchema: {
    containerSizeDefinitionsOverride: {
      "ui:widget":
        projectType === ProjectType.AttachedProject
          ? widgets.RadioBoxWidget
          : "hidden",
      "ui:showLabel": false,
    },
    containerSizeDefinitions: {
      "ui:addButtonText": "Add Container Size",
      "ui:orderable": false,
      "ui:showLabel": false,
      "ui:useExpandableCard": true,
      items: {
        "ui:displayTitle": "New Container Size",
        name: {
          "ui:description": "Alias of the container size.",
          "ui:placeholder": "e.g. X-Large",
        },
        cpu: {
          "ui:description":
            "Number of CPU units that will be allocated. 1024 CPU units is equivalent to 1vCPU.",
        },
        memoryMb: {
          "ui:description":
            "The memory (in MB) that the container will be allocated.",
        },
      },
    },
    repoData: {
      "ui:orderable": false,
      "ui:readonly": true,
      containerSizeDefinitions: {
        "ui:showLabel": false,
        "ui:useExpandableCard": true,
      },
    },
  },
});
