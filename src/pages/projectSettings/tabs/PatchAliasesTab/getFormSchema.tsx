import { GetFormSchema } from "components/SpruceForm";
import { AccordionFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { StyledLink } from "components/styles";
import { patchAliasesDocumentationUrl } from "constants/externalResources";
import { alias, form, PatchTriggerAliasStatus, ProjectType } from "../utils";
import { TaskSpecifier } from "./types";

const {
  baseProps: { task, variant },
  patchAliasArray,
} = alias;
const { overrideRadioBox } = form;

export const getFormSchema = (
  projectType: ProjectType
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    properties: {
      patchAliases: {
        title: "Patch Aliases",
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
            items: {
              properties: {
                alias: {
                  default: "",
                  minLength: 1,
                  title: "Alias",
                  type: "string" as "string",
                },
                childProjectIdentifier: {
                  default: "",
                  minLength: 1,
                  title: "Project",
                  type: "string" as "string",
                },
                isGithubTriggerAlias: {
                  title: "Add to GitHub Trigger Alias",
                  type: "boolean" as "boolean",
                },
                parentAsModule: {
                  title: "Module",
                  type: "string" as "string",
                },
                status: {
                  default: "",
                  oneOf: [
                    {
                      enum: [""],
                      title: "Select event…",
                      type: "string" as "string",
                    },
                    ...Object.entries(PatchTriggerAliasStatus).map(
                      ([value, title]) => ({
                        enum: [value],
                        title,
                        type: "string" as "string",
                      })
                    ),
                  ],
                  title: "Wait on",
                  type: "string" as "string",
                },
                taskSpecifiers: {
                  items: {
                    dependencies: {
                      specifier: {
                        oneOf: [
                          {
                            properties: {
                              patchAlias: {
                                default: "",
                                minLength: 1,
                                title: "Patch Alias",
                                type: "string" as "string",
                              },
                              specifier: {
                                enum: [TaskSpecifier.PatchAlias],
                              },
                            },
                          },
                          {
                            properties: {
                              specifier: {
                                enum: [TaskSpecifier.VariantTask],
                              },
                              taskRegex: task.schema,
                              variantRegex: variant.schema,
                            },
                          },
                        ],
                      },
                    },
                    properties: {
                      specifier: {
                        default: TaskSpecifier.PatchAlias,
                        oneOf: [
                          {
                            enum: [TaskSpecifier.PatchAlias],
                            title: "Patch Alias",
                            type: "string" as "string",
                          },
                          {
                            enum: [TaskSpecifier.VariantTask],
                            title: "Variant/Task",
                            type: "string" as "string",
                          },
                        ],
                        title: "Specify Via",
                        type: "string" as "string",
                      },
                    },
                    title: "Variant/Task Pair",
                    type: "object" as "object",
                  },
                  minItems: 1,
                  type: "array" as "array",
                },
              },
              type: "object" as "object",
            },
            type: "array" as "array",
          }
        ),
      },
    },
    type: "object" as "object",
  },
  uiSchema: {
    patchAliases: {
      aliases: patchAliasArray.uiSchema,
      aliasesOverride: {
        "ui:data-cy": "patch-aliases-override-radio-box",
        "ui:showLabel": false,
        "ui:widget":
          projectType === ProjectType.AttachedProject
            ? widgets.RadioBoxWidget
            : "hidden",
      },
      repoData: {
        aliases: patchAliasArray.repoData.uiSchema,
      },
      "ui:description": PatchAliasesDescription,
    },
    patchTriggerAliases: {
      aliases: aliasesUiSchema,
      aliasesOverride: {
        "ui:data-cy": "patch-trigger-aliases-override-radio-box",
        "ui:showLabel": false,
        "ui:widget":
          projectType === ProjectType.AttachedProject
            ? widgets.RadioBoxWidget
            : "hidden",
      },
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
  items: {
    alias: {
      "ui:data-cy": "pta-alias-input",
    },
    childProjectIdentifier: {
      "ui:data-cy": "project-input",
    },
    isGithubTriggerAlias: {
      "ui:border": "top",
      "ui:data-cy": "github-trigger-alias-checkbox",
    },
    parentAsModule: {
      "ui:data-cy": "module-input",
      "ui:description":
        "If you want tests to include the parent project's changes, add the parent project as a module.",
      "ui:optional": true,
    },
    status: {
      "ui:allowDeselect": false,
    },
    taskSpecifiers: {
      items: {
        patchAlias: {
          "ui:data-cy": "patch-alias-input",
        },
        specifier: {
          "ui:aria-controls": ["patchAlias", "taskRegex", "variantRegex"],
          "ui:widget": widgets.SegmentedControlWidget,
        },
        taskRegex: {
          "ui:data-cy": "task-regex-input",
        },
        "ui:ObjectFieldTemplate": AccordionFieldTemplate,
        "ui:defaultOpen": true,
        variantRegex: {
          "ui:data-cy": "variant-regex-input",
        },
      },
      "ui:addButtonText": "Add Task Regex Pair",
      "ui:orderable": false,
      "ui:showLabel": false,
      "ui:topAlignDelete": true,
    },
    "ui:displayTitle": "New Patch Trigger Alias",
  },
  "ui:addButtonText": "Add Patch Trigger Alias",
  "ui:orderable": false,
  "ui:showLabel": false,
  "ui:useExpandableCard": true,
};

const PatchAliasesDescription = (
  <>
    Specify aliases to use with the CLI. Aliases may be specified multiple
    times. The result will be their union. All regular expressions must be valid
    Golang regular expressions. Use an alias with the --alias flag passed to the
    CLI patch command. These aliases{" "}
    <StyledLink href={patchAliasesDocumentationUrl}>may be defined</StyledLink>{" "}
    in this project&rsquo;s config YAML instead. The active set of patch aliases
    for the project will be the merged result of aliases defined on this page
    and in the config YAML, with this page taking precedence in the case of
    duplicate names.
  </>
);
