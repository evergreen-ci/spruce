import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { form, ProjectType } from "../utils";

const { radioBoxOptions } = form;

export const getFormSchema = (
  projectType: ProjectType,
  repoData?: any
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    properties: {
      accessSettings: {
        properties: {
          restricted: {
            oneOf: radioBoxOptions(
              ["Restricted", "Unrestricted"],
              repoData?.accessSettings?.restricted
            ),
            title: "Internal Access",
            type: ["boolean", "null"],
          },
        },
        title: "Access Settings",
        type: "object" as "object",
      },
      admin: {
        properties: {
          admins: {
            items: {
              default: "",
              minLength: 1,
              title: "Username",
              type: "string" as "string",
            },
            type: "array" as "array",
          },
        },
        title: "Admin",
        type: "object" as "object",
      },
    },
    type: "object" as "object",
  },
  uiSchema: {
    accessSettings: {
      restricted: {
        "ui:description":
          "Logged-in users by default will not be able to access this project. Access must be granted via MANA.",
        "ui:widget": widgets.RadioBoxWidget,
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "access",
    },
    admin: {
      admins: {
        "ui:addButtonText": "Add Username",
        "ui:description": getAdminsDescription(projectType),
        "ui:orderable": false,
        "ui:showLabel": false,
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "admin",
    },
  },
});

const getAdminsDescription = (projectType: ProjectType): string => {
  const descriptions = {
    [ProjectType.Repo]:
      "Admins for this repo will be able to edit repo settings and any attached branches’ settings.",
    [ProjectType.AttachedProject]:
      "Admins for this branch will be able to edit branch settings and view repo settings.",
    default: "Admins for this branch will be able to edit branch settings.",
  };
  const description = descriptions[projectType] || descriptions.default;
  return `${description} All admins will have access to create new projects on Evergreen.`;
};
