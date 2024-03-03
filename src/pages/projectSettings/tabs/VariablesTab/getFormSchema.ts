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
  modalButton?: JSX.Element,
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    definitions: {
      varsArray: {
        type: "array" as "array",
        items: {
          type: "object" as "object",
          properties: {
            varName: {
              type: "string" as "string",
              title: "Variable Name",
              default: "",
              minLength: 1,
              format: "noStartingOrTrailingWhitespace",
            },
            varValue: {
              type: "string" as "string",
              title: "Variable",
              default: "",
              minLength: 1,
            },
            isPrivate: {
              type: "boolean" as "boolean",
              title: "Private",
            },
            isAdminOnly: {
              type: "boolean" as "boolean",
              title: "Admin Only",
            },
            isDisabled: {
              type: "boolean" as "boolean",
            },
          },
        },
      },
    },
    type: "object" as "object",
    properties: {
      vars: { $ref: "#/definitions/varsArray" },
      ...(repoData && {
        repoData: {
          type: "object" as "object",
          title: "Repo Variables",
          ...(repoData.vars.length === 0 && {
            description: "Repo has no variables defined.",
          }),
          properties: {
            vars: { $ref: "#/definitions/varsArray" },
          },
        },
      }),
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    vars: {
      "ui:addButtonText": "Add variables",
      "ui:description": getDescription(projectType),
      "ui:fullWidth": true,
      "ui:orderable": false,
      "ui:secondaryButton": modalButton,
      "ui:showLabel": false,
      items: {
        "ui:ObjectFieldTemplate": VariableRow,
        "ui:label": false,
        options: { repoData },
        varName: {
          "ui:data-cy": "var-name-input",
        },
        varValue: {
          "ui:data-cy": "var-value-input",
          "ui:elementWrapperCSS": varCSS,
          "ui:widget": widgets.TextareaWidget,
        },
        isPrivate: {
          "ui:tooltipDescription":
            "Private variables have redacted values on the Project Page and the API and cannot be updated.",
          "ui:data-cy": "var-private-input",
        },
        isAdminOnly: {
          "ui:tooltipDescription":
            "Admin only variables can only be used by project admins.",
          "ui:data-cy": "var-admin-input",
        },
      },
    },
    repoData: {
      vars: {
        "ui:fullWidth": true,
        "ui:readonly": true,
        "ui:showLabel": false,
        items: {
          "ui:ObjectFieldTemplate": VariableRow,
          varValue: {
            "ui:widget": widgets.TextareaWidget,
          },
        },
      },
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
