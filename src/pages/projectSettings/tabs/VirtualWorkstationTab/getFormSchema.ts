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
  repoData?: VWFormState,
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      gitClone: {
        type: ["boolean", "null"],
        title: "Git Clone",
        oneOf: radioBoxOptions(["Enabled", "Disabled"], repoData?.gitClone),
      },
      commands: {
        title: "Commands",
        description: `Commands to be run for this project, and optionally a subdirectory to run in (starting at home/${identifier}/). These will be run in order using the setup CLI command from the workstation.`,
        ...overrideRadioBox(
          "setupCommands",
          ["Override Repo Commands", "Default to Repo Commands"],
          {
            type: "array" as "array",
            default: [],
            items: {
              type: "object" as "object",
              properties: {
                command: {
                  type: "string" as "string",
                  title: "Command",
                  minLength: 1,
                  default: "",
                },
                directory: {
                  type: "string" as "string",
                  title: "Directory",
                },
              },
            },
          },
        ),
      },
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    gitClone: {
      "ui:widget": widgets.RadioBoxWidget,
      "ui:description": `If git clone is enabled, "git clone -b <branch_name> git@github.com:<owner>/<repo>.git" will be run as defined in this project.
        Users must have SSH keys configured in github before running this command.`,
    },
    commands: {
      setupCommandsOverride: {
        "ui:data-cy": "commands-override-radio-box",
        "ui:widget":
          projectType === ProjectType.AttachedProject
            ? widgets.RadioBoxWidget
            : "hidden",
        "ui:showLabel": false,
      },
      setupCommands: {
        "ui:addButtonText": "Add Command",
        "ui:addToEnd": true,
        "ui:border": true,
        "ui:fullWidth": true,
        "ui:showLabel": false,
        items: {
          "ui:ObjectFieldTemplate": CommandRow,
          "ui:label": false,
          command: {
            "ui:data-cy": "command-input",
            "ui:widget": widgets.TextareaWidget,
          },
          directory: {
            "ui:data-cy": "directory-input",
            "ui:optional": true,
          },
        },
      },
      repoData: {
        setupCommands: {
          "ui:border": true,
          "ui:fullWidth": true,
          "ui:orderable": false,
          "ui:readonly": true,
          "ui:showLabel": false,
          items: {
            "ui:ObjectFieldTemplate": CommandRow,
            command: {
              "ui:widget": widgets.TextareaWidget,
            },
          },
        },
      },
    },
  },
});
