import { css } from "@emotion/react";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { ProjectType } from "../utils";
import { VariablesFormState } from "./types";
import { VariableRow } from "./VariableRow";

export const getFormSchema = (
  projectType: ProjectType,
  repoData?: VariablesFormState,
  modalButton?: JSX.Element
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    definitions: {
      varsArray: {
        items: {
          properties: {
            isAdminOnly: {
              title: "Admin Only",
              type: "boolean" as "boolean",
            },
            isDisabled: {
              type: "boolean" as "boolean",
            },
            isPrivate: {
              title: "Private",
              type: "boolean" as "boolean",
            },
            varName: {
              default: "",
              minLength: 1,
              title: "Variable Name",
              type: "string" as "string",
            },
            varValue: {
              default: "",
              minLength: 1,
              title: "Variable",
              type: "string" as "string",
            },
          },
          type: "object" as "object",
        },
        type: "array" as "array",
      },
    },
    properties: {
      vars: { $ref: "#/definitions/varsArray" },
      ...(repoData && {
        repoData: {
          title: "Repo Variables",
          type: "object" as "object",
          ...(repoData.vars.length === 0 && {
            description: "Repo has no variables defined.",
          }),
          properties: {
            vars: { $ref: "#/definitions/varsArray" },
          },
        },
      }),
    },
    type: "object" as "object",
  },
  uiSchema: {
    repoData: {
      vars: {
        items: {
          "ui:ObjectFieldTemplate": VariableRow,
          varValue: {
            "ui:widget": widgets.TextareaWidget,
          },
        },
        "ui:fullWidth": true,
        "ui:readonly": true,
        "ui:showLabel": false,
      },
    },
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    vars: {
      items: {
        isAdminOnly: {
          "ui:data-cy": "var-admin-input",
          "ui:tooltipDescription":
            "Admin only variables can only be used by project admins.",
        },
        isPrivate: {
          "ui:data-cy": "var-private-input",
          "ui:tooltipDescription":
            "Private variables have redacted values on the Project Page and the API and cannot be updated.",
        },
        options: { repoData },
        "ui:ObjectFieldTemplate": VariableRow,
        varName: {
          "ui:data-cy": "var-name-input",
        },
        varValue: {
          "ui:data-cy": "var-value-input",
          "ui:elementWrapperCSS": varCSS,
          "ui:widget": widgets.TextareaWidget,
        },
      },
      "ui:addButtonText": "Add variables",
      "ui:description": getDescription(projectType),
      "ui:fullWidth": true,
      "ui:orderable": false,
      "ui:secondaryButton": modalButton,
      "ui:showLabel": false,
    },
  },
});

const getDescription = (projectType: ProjectType): string => {
  if (projectType === ProjectType.Repo) {
    return "Variables defined here will be used by all branches attached to this project, unless a variable is specifically overridden in the branch.";
  }
  if (projectType === ProjectType.AttachedProject) {
    return "Variables are sourced from both the repo-level and branch-level settings. If a variable name is defined at both the repo-level and branch-level, then the branch variable will override the repo variable.";
  }
};

const varCSS = css`
  margin-bottom: 4px;
`;
