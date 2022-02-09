import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import widgets from "components/SpruceForm/Widgets";
import { alias, form } from "../utils";
import { FormState } from "./types";

const { aliasArraySchema, aliasRowUiSchema } = alias;
const { overrideRadioBox } = form;

export const getFormSchema = (
  repoData?: FormState
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
          repoData?.patchAliases?.aliases === undefined
            ? "hidden"
            : widgets.RadioBoxWidget,
        "ui:showLabel": false,
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
