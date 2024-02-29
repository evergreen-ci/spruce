import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { form, ProjectType } from "../utils";

const { radioBoxOptions } = form;

export const getFormSchema = (
  projectType: ProjectType,
  repoData?: any,
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      accessSettings: {
        type: "object" as "object",
        title: "Access Settings",
        properties: {
          restricted: {
            type: ["boolean", "null"],
            title: "Internal Access",
            oneOf: radioBoxOptions(
              ["Restricted", "Unrestricted"],
              repoData?.accessSettings?.restricted,
            ),
          },
        },
      },
      admin: {
        type: "object" as "object",
        title: "Admin",
        properties: {
          admins: {
            type: "array" as "array",
            items: {
              type: "string" as "string",
              title: "Username",
              default: "",
              minLength: 1,
              format: "noStartingOrTrailingWhitespace",
            },
          },
        },
      },
    },
  },
  uiSchema: {
    accessSettings: {
      "ui:rootFieldId": "access",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      restricted: {
        "ui:description":
          "Logged-in users by default will not be able to access this project. Access must be granted via MANA.",
        "ui:widget": widgets.RadioBoxWidget,
      },
    },
    admin: {
      "ui:rootFieldId": "admin",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      admins: {
        "ui:addButtonText": "Add Username",
        "ui:description": getAdminsDescription(projectType),
        "ui:orderable": false,
        "ui:showLabel": false,
      },
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
