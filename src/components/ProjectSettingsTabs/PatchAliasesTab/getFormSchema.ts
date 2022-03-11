import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import widgets from "components/SpruceForm/Widgets";
import { alias, form, ProjectType } from "../utils";

const { patchAliasArray } = alias;
const { overrideRadioBox } = form;

export const getFormSchema = (
  projectType: ProjectType
): {
  fields: Record<string, Field>;
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      patchAliases: {
        title: "Patch Aliases",
        description:
          "Specify aliases to use with the CLI. Aliases may be specified multiple times. The result will be their union. All regular expressions must be valid Golang regular expressions. Use an alias with the --alias flag passed to the CLI patch command.",
        ...overrideRadioBox(
          "aliases",
          ["Override Repo Patch Aliases", "Default to Repo Patch Aliases"],
          patchAliasArray.schema
        ),
      },
    },
  },
  uiSchema: {
    patchAliases: {
      aliasesOverride: {
        "ui:widget":
          projectType === ProjectType.AttachedProject
            ? widgets.RadioBoxWidget
            : "hidden",
        "ui:showLabel": false,
        "ui:data-cy": "patch-aliases-override-radio-box",
      },
      aliases: patchAliasArray.uiSchema,
      repoData: {
        aliases: patchAliasArray.repoData.uiSchema,
      },
    },
  },
});
