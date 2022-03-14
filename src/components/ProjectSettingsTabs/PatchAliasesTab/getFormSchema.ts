import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import { AccordionFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { alias, form, ProjectType } from "../utils";
import { TaskSpecifiers } from "./types";

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
      patchTriggerAliases: {
        title: "Patch Trigger Aliases",
        ...overrideRadioBox(
          "aliases",
          [
            "Override Repo Patch Trigger Aliases",
            "Default to Repo Patch Trigger Aliases",
          ],
          {
            type: "array" as "array",
            items: {
              type: "object" as "object",
              required: ["alias", "childProjectIdentifier"],
              properties: {
                alias: {
                  type: "string" as "string",
                  title: "Alias",
                },
                childProjectIdentifier: {
                  type: "string" as "string",
                  title: "Project",
                },
                parentAsModule: {
                  type: "string" as "string",
                  title: "Module",
                },
                status: {
                  type: ["string", "null"],
                  title: "Wait on",
                  oneOf: [
                    {
                      type: "string" as "string",
                      title: "Any completed status",
                      enum: ["*"],
                    },
                    {
                      type: "string" as "string",
                      title: "Success",
                      enum: ["succeeded"],
                    },
                    {
                      type: "string" as "string",
                      title: "Failure",
                      enum: ["failed"],
                    },
                    { enum: [null] },
                  ],
                },
                taskSpecifiers: {
                  type: "array" as "array",
                  items: {
                    type: "object" as "object",
                    title: "Variant/Task Pair",
                    properties: {
                      specifier: {
                        type: "string" as "string",
                        title: "Specify Via",
                        default: TaskSpecifiers.PatchAlias,
                        oneOf: [
                          {
                            type: "string" as "string",
                            title: "Patch Alias",
                            enum: [TaskSpecifiers.PatchAlias],
                          },
                          {
                            type: "string" as "string",
                            title: "Variant/Task",
                            enum: [TaskSpecifiers.VariantTask],
                          },
                        ],
                      },
                    },
                    dependencies: {
                      specifier: {
                        oneOf: [
                          {
                            properties: {
                              specifier: {
                                enum: [TaskSpecifiers.PatchAlias],
                              },
                              patchAlias: {
                                type: "string" as "string",
                                title: "Patch Alias",
                              },
                            },
                          },
                          {
                            properties: {
                              specifier: {
                                enum: [TaskSpecifiers.VariantTask],
                              },
                              variantRegex: {
                                type: "string" as "string",
                                title: "Variant Regex",
                              },
                              taskRegex: {
                                type: "string" as "string",
                                title: "Task Regex",
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
                isGithubTriggerAlias: {
                  type: "boolean" as "boolean",
                  title: "Add to GitHub Trigger Alias",
                },
              },
            },
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
      aliases: patchAliasArray.uiSchema,
      repoData: {
        aliases: patchAliasArray.repoData.uiSchema,
      },
    },
    patchTriggerAliases: {
      aliasesOverride: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:showLabel": false,
        "ui:data-cy": "patch-trigger-aliases-override-radio-box",
      },
      aliases: {
        "ui:addButtonText": "Add Patch Trigger Alias",
        "ui:showLabel": false,
        "ui:useExpandableCard": true,
        items: {
          "ui:displayTitle": "New Patch Trigger Alias",
          alias: {
            "ui:showErrors": false,
          },
          childProjectIdentifier: {
            "ui:showErrors": false,
          },
          status: {
            "ui:placeholder": "Select event…",
          },
          taskSpecifiers: {
            "ui:addButtonText": "Add Task Regex Pair",
            "ui:showLabel": false,
            "ui:topAlignDelete": true,
            items: {
              "ui:ObjectFieldTemplate": AccordionFieldTemplate,
              "ui:defaultOpen": true,
              specifier: {
                "ui:widget": widgets.SegmentedControlWidget,
                "ui:aria-controls": ["patchAlias", "taskRegex", "variantRegex"],
              },
            },
          },
        },
      },
    },
  },
});
