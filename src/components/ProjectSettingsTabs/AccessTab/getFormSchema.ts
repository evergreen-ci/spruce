import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { form, ProjectVariant } from "../utils";

const { radioBoxOptions } = form;

export const getFormSchema = (
  projectVariant: ProjectVariant,
  repoData?: any
): {
  fields: Record<string, Field>;
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      accessSettings: {
        type: "object" as "object",
        title: "Access Settings",
        properties: {
          private: {
            type: ["boolean", "null"],
            oneOf: radioBoxOptions(
              ["Private", "Public"],
              repoData?.accessSettings?.private
            ),
          },
          restricted: {
            type: ["boolean", "null"],
            title: "Project Access",
            oneOf: radioBoxOptions(
              ["Restricted", "Unrestricted"],
              repoData?.accessSettings?.restricted
            ),
          },
        },
      },
      admin: {
        type: "object" as "object",
        title: "Admin",
        properties: {
          admins: {
            type: ["array", "null"],
            items: {
              type: "object" as "object",
              properties: {
                username: {
                  type: "string" as "string",
                  title: "Username",
                },
              },
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
      private: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:showLabel": false,
      },
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
        "ui:description": getAdminsDescription(projectVariant),
        "ui:showLabel": false,
      },
    },
  },
});

const getAdminsDescription = (projectVariant: ProjectVariant): string => {
  if (projectVariant === ProjectVariant.Repo) {
    return "Admins for this repo will be able to edit repo settings and any attached branches’ settings.";
  }
  if (projectVariant === ProjectVariant.AttachedProject) {
    return "Admins for this branch will be able to edit branch settings and view repo settings.";
  }
  return "Admins for this branch will be able to edit branch settings.";
};
