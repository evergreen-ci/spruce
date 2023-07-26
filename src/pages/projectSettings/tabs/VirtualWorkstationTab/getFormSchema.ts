import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { form, ProjectType } from "../utils";
import { CommandRow } from "./CommandRow";
import { VWFormState } from "./types";

const { overrideRadioBox, radioBoxOptions } = form;

export const getFormSchema = (
  identifier: string,
  projectType: ProjectType,
  repoData?: VWFormState
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    properties: {
      commands: {
        description: `Commands to be run for this project, and optionally a subdirectory to run in (starting at home/${identifier}/). These will be run in order using the setup CLI command from the workstation.`,
        title: "Commands",
        ...overrideRadioBox(
          "setupCommands",
          ["Override Repo Commands", "Default to Repo Commands"],
          {
            default: [],
            items: {
              properties: {
                command: {
                  default: "",
                  minLength: 1,
                  title: "Command",
                  type: "string" as "string",
                },
                directory: {
                  title: "Directory",
                  type: "string" as "string",
                },
              },
              type: "object" as "object",
            },
            type: "array" as "array",
          }
        ),
      },
      gitClone: {
        oneOf: radioBoxOptions(["Enabled", "Disabled"], repoData?.gitClone),
        title: "Git Clone",
        type: ["boolean", "null"],
      },
    },
    type: "object" as "object",
  },
  uiSchema: {
    commands: {
      repoData: {
        setupCommands: {
          items: {
            command: {
              "ui:widget": widgets.TextareaWidget,
            },
            "ui:ObjectFieldTemplate": CommandRow,
          },
          "ui:border": true,
          "ui:fullWidth": true,
          "ui:orderable": false,
          "ui:readonly": true,
          "ui:showLabel": false,
        },
      },
      setupCommands: {
        items: {
          command: {
            "ui:data-cy": "command-input",
            "ui:widget": widgets.TextareaWidget,
          },
          directory: {
            "ui:data-cy": "directory-input",
            "ui:optional": true,
          },
          "ui:ObjectFieldTemplate": CommandRow,
        },
        "ui:addButtonText": "Add Command",
        "ui:addToEnd": true,
        "ui:border": true,
        "ui:fullWidth": true,
        "ui:showLabel": false,
      },
      setupCommandsOverride: {
        "ui:data-cy": "commands-override-radio-box",
        "ui:showLabel": false,
        "ui:widget":
          projectType === ProjectType.AttachedProject
            ? widgets.RadioBoxWidget
            : "hidden",
      },
    },
    gitClone: {
      "ui:description": `If git clone is enabled, "git clone -b <branch_name> git@github.com:<owner>/<repo>.git" will be run as defined in this project.
        Users must have SSH keys configured in github before running this command.`,
      "ui:widget": widgets.RadioBoxWidget,
    },
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
});
