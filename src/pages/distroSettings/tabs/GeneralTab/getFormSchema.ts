import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";

export const getFormSchema = (
  isContainerDistro: boolean,
  minimumHosts: number,
): ReturnType<GetFormSchema> => ({
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
      distroOptions: {
        type: "object" as "object",
        title: "Distro Options",
        properties: {
          adminOnly: {
            type: "boolean" as "boolean",
            title: "Admin only",
            default: false,
          },
          isCluster: {
            type: "boolean" as "boolean",
            title: "Mark distro as cluster",
            default: false,
          },
          disableShallowClone: {
            type: "boolean" as "boolean",
            title: "Disable shallow clone for this distro",
            default: false,
          },
          disabled: {
            type: "boolean" as "boolean",
            title: "Disable queueing for this distro",
            default: false,
          },
          note: {
            type: "string" as "string",
            title: "Notes",
            default: "",
          },
        },
      },
    },
  },
  uiSchema: {
    distroName: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      identifier: {
        ...(isContainerDistro && {
          "ui:warnings": [
            "Distro is a container pool, so it cannot be spawned for tasks.",
          ],
        }),
      },
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
    distroOptions: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      adminOnly: {
        "ui:description":
          "Admin-only distros are not selectable by general users (e.g. when spawning a host). They do not have their access controlled beyond being hidden.",
      },
      isCluster: {
        "ui:description":
          "Jobs will not be run on this host. Used for special purposes.",
      },
      disabled: {
        "ui:description": "Tasks already in the task queue will be removed.",
        ...(minimumHosts > 0 && {
          "ui:tooltipDescription": `This will still allow the minimum number of hosts (${minimumHosts}) to start`,
        }),
      },
      note: {
        "ui:rows": 7,
        "ui:widget": "textarea",
      },
    },
  },
});
