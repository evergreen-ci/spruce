import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import widgets from "components/SpruceForm/Widgets";
import { alias, form, ProjectType } from "../utils";

const { aliasArraySchema, aliasRowUiSchema } = alias;
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
    definitions: {
      aliasArray: aliasArraySchema,
    },
    type: "object" as "object",
    properties: {
      patchAliases: {
        title: "Patch Aliases",
        description:
          "Specify aliases to use with the CLI. Aliases may be specified multiple times. The result will be their union. All regular expressions must be valid Golang regular expressions. Use an alias with the --alias flag passed to the CLI patch command.",
        ...overrideRadioBox(
          "aliases",
          ["Override Repo Patch Aliases", "Default to Repo Patch Aliases"],
          {
            $ref: "#/definitions/aliasArray",
          }
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
      aliases: {
        ...aliasRowUiSchema({
          addButtonText: "Add Patch Alias",
          accordionTitle: "New Patch Alias",
          aliasHidden: false,
          useExpandableCard: true,
        }),
      },
      repoData: {
        aliases: {
          ...aliasRowUiSchema({
            accordionTitle: "Patch Alias",
            aliasHidden: false,
            isRepo: true,
            useExpandableCard: true,
          }),
        },
      },
    },
  },
});
