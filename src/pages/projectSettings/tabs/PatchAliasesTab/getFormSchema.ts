import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import { AccordionFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { alias, form, PatchTriggerAliasStatus, ProjectType } from "../utils";
import { TaskSpecifier } from "./types";

const {
  baseProps: { task, variant },
  patchAliasArray,
} = alias;
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
              properties: {
                alias: {
                  type: "string" as "string",
                  title: "Alias",
                  default: "",
                  minLength: 1,
                },
                childProjectIdentifier: {
                  type: "string" as "string",
                  title: "Project",
                  default: "",
                  minLength: 1,
                },
                parentAsModule: {
                  type: "string" as "string",
                  title: "Module",
                },
                status: {
                  type: "string" as "string",
                  title: "Wait on",
                  default: "",
                  oneOf: [
                    {
                      type: "string" as "string",
                      title: "Select event…",
                      enum: [""],
                    },
                    ...Object.entries(PatchTriggerAliasStatus).map(
                      ([value, title]) => ({
                        type: "string" as "string",
                        title,
                        enum: [value],
                      })
                    ),
                  ],
                },
                taskSpecifiers: {
                  type: "array" as "array",
                  minItems: 1,
                  items: {
                    type: "object" as "object",
                    title: "Variant/Task Pair",
                    properties: {
                      specifier: {
                        type: "string" as "string",
                        title: "Specify Via",
                        default: TaskSpecifier.PatchAlias,
                        oneOf: [
                          {
                            type: "string" as "string",
                            title: "Patch Alias",
                            enum: [TaskSpecifier.PatchAlias],
                          },
                          {
                            type: "string" as "string",
                            title: "Variant/Task",
                            enum: [TaskSpecifier.VariantTask],
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
                                enum: [TaskSpecifier.PatchAlias],
                              },
                              patchAlias: {
                                type: "string" as "string",
                                title: "Patch Alias",
                                default: "",
                                minLength: 1,
                              },
                            },
                          },
                          {
                            properties: {
                              specifier: {
                                enum: [TaskSpecifier.VariantTask],
                              },
                              variantRegex: variant.schema,
                              taskRegex: task.schema,
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
        "ui:widget":
          projectType === ProjectType.AttachedProject
            ? widgets.RadioBoxWidget
            : "hidden",
        "ui:showLabel": false,
        "ui:data-cy": "patch-trigger-aliases-override-radio-box",
      },
      aliases: aliasesUiSchema,
      repoData: {
        aliases: {
          ...aliasesUiSchema,
          "ui:readonly": true,
        },
      },
    },
  },
});

const aliasesUiSchema = {
  "ui:addButtonText": "Add Patch Trigger Alias",
  "ui:orderable": false,
  "ui:showLabel": false,
  "ui:useExpandableCard": true,
  items: {
    "ui:displayTitle": "New Patch Trigger Alias",
    alias: {
      "ui:data-cy": "pta-alias-input",
    },
    childProjectIdentifier: {
      "ui:data-cy": "project-input",
    },
    parentAsModule: {
      "ui:optional": true,
      "ui:data-cy": "module-input",
    },
    status: {
      "ui:allowDeselect": false,
    },
    taskSpecifiers: {
      "ui:addButtonText": "Add Task Regex Pair",
      "ui:orderable": false,
      "ui:showLabel": false,
      "ui:topAlignDelete": true,
      items: {
        "ui:ObjectFieldTemplate": AccordionFieldTemplate,
        "ui:defaultOpen": true,
        specifier: {
          "ui:widget": widgets.SegmentedControlWidget,
          "ui:aria-controls": ["patchAlias", "taskRegex", "variantRegex"],
        },
        patchAlias: {
          "ui:data-cy": "patch-alias-input",
        },
        taskRegex: {
          "ui:data-cy": "task-regex-input",
        },
        variantRegex: {
          "ui:data-cy": "variant-regex-input",
        },
      },
    },
    isGithubTriggerAlias: {
      "ui:border": "top",
      "ui:data-cy": "github-trigger-alias-checkbox",
    },
  },
};
