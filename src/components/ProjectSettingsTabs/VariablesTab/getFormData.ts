import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { FormState } from "./types";
import { VariableRowFieldTemplate } from "./VariableRowFieldTemplate";

export const getFormData = (
  useRepoSettings: boolean,
  repoData?: FormState
): {
  fields: Record<string, Field>;
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  fields: {},
  schema: {
    definitions: {
      varsArray: {
        type: "array" as "array",
        items: {
          type: "object" as "object",
          properties: {
            name: {
              type: "string" as "string",
              title: "Variable Name",
            },
            value: {
              type: "string" as "string",
              title: "Variable",
            },
            private: {
              type: "boolean" as "boolean",
              title: "Private",
            },
          },
        },
      },
    },
    type: "object" as "object",
    properties: {
      // prettier-ignore
      vars: { "$ref": "#/definitions/varsArray" },
      ...(repoData && {
        repoData: {
          type: "object" as "object",
          title: "Repo Project Variables",
          properties: {
            // prettier-ignore
            vars: { "$ref": "#/definitions/varsArray" },
          },
        },
      }),
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    vars: {
      "ui:buttonText": "Add Variables",
      "ui:description": getDescription(useRepoSettings),
      "ui:fullWidth": true,
      "ui:showLabel": false,
      items: {
        "ui:ObjectFieldTemplate": VariableRowFieldTemplate,
        options: { repoData },
        value: {
          "ui:widget": widgets.TextareaWidget,
        },
      },
    },
    repoData: {
      vars: {
        "ui:addable": false,
        "ui:fullWidth": true,
        "ui:readonly": true,
        "ui:showLabel": false,
        items: {
          "ui:ObjectFieldTemplate": VariableRowFieldTemplate,
          value: {
            "ui:widget": widgets.TextareaWidget,
          },
        },
      },
    },
  },
});

const getDescription = (useRepoSettings: boolean): string => {
  // Repo page, where useRepoSettings field does not exist
  if (useRepoSettings === undefined) {
    return "Variables defined here will be used by all branches attached to this project, unless a variable is specifically overridden in the branch.";
  }
  // Project page
  return useRepoSettings
    ? "Variables are sourced from both the repo-level and branch-level settings. If a variable name is defined at both the repo-level and branch-level, then the branch variable will override the repo variable."
    : null;
};
