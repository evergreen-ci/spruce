import { AccordionFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { ProjectAlias, ProjectAliasInput } from "gql/generated/types";

export enum AliasNames {
  CommitQueue = "__commit_queue",
  GithubPr = "__github",
  GithubCheck = "__github_checks",
  GitTag = "__git_tag",
}

export enum GitTagSpecifier {
  ConfigFile = "CONFIG_FILE",
  VariantTask = "VARIANT_TASK",
}

export enum VariantTaskSpecifier {
  Regex = "REGEX",
  Tags = "TAGS",
}

const pairHasError = (regex: string, tags: string[]): boolean => {
  const hasInvalidTags =
    !tags || !tags?.length || tags.every((tag) => tag === "");
  return regex === "" && hasInvalidTags;
};

export const aliasHasError = ({
  alias,
  gitTag,
  remotePath,
  tasks,
  variants,
}: Partial<AliasFormType>): boolean => {
  const variantTaskHasError =
    pairHasError(tasks.task, tasks.taskTags) ||
    pairHasError(variants.variant, variants.variantTags);
  if (alias === AliasNames.GitTag) {
    return variantTaskHasError || !gitTag || !remotePath;
  }
  return variantTaskHasError;
};

// Bucket aliases according to their "alias" field
export const sortAliases = (
  aliases: ProjectAlias[]
): Record<string, ProjectAlias[]> =>
  aliases.reduce(
    (o, a) => {
      if (a.alias === AliasNames.GithubPr) {
        o.githubPrAliases.push(a);
      } else if (a.alias === AliasNames.GithubCheck) {
        o.githubCheckAliases.push(a);
      } else if (a.alias === AliasNames.GitTag) {
        o.gitTagAliases.push(a);
      } else if (a.alias === AliasNames.CommitQueue) {
        o.commitQueueAliases.push(a);
      } else {
        o.patchAliases.push(a);
      }
      return o;
    },
    {
      commitQueueAliases: [],
      githubPrAliases: [],
      githubCheckAliases: [],
      gitTagAliases: [],
      patchAliases: [],
    }
  );

const tranformVariants = ({
  specifier,
  variant,
  variantTags,
}): {
  variant: string;
  variantTags: string[];
} =>
  specifier === VariantTaskSpecifier.Regex
    ? {
        variant,
        variantTags: [],
      }
    : {
        variant: "",
        variantTags: variantTags?.filter((tag) => tag) ?? [],
      };

const transformTasks = ({
  specifier,
  task,
  taskTags,
}): {
  task: string;
  taskTags: string[];
} =>
  specifier === VariantTaskSpecifier.Regex
    ? {
        task,
        taskTags: [],
      }
    : {
        task: "",
        taskTags: taskTags?.filter((tag) => tag) ?? [],
      };

export type AliasFormType = {
  id: string;
  alias: string;
  specifier?: GitTagSpecifier;
  gitTag: string;
  remotePath: string;
  variants: {
    specifier: VariantTaskSpecifier;
    variant: string;
    variantTags: string[];
  };
  tasks: {
    specifier: VariantTaskSpecifier;
    task: string;
    taskTags: string[];
  };
};

// Given alias form data, transform it to be safely saved
export const transformAliases = (
  aliases: Partial<AliasFormType>[],
  override: boolean,
  aliasName?: AliasNames
): ProjectAliasInput[] =>
  override
    ? aliases.map((a) => {
        if (aliasHasError(a)) {
          return;
        }
        const { id, alias, gitTag, remotePath, specifier, tasks, variants } = a;
        if (aliasName === AliasNames.GitTag) {
          return specifier === GitTagSpecifier.ConfigFile
            ? {
                id: id || "",
                alias: aliasName,
                gitTag,
                remotePath,
                variant: "",
                variantTags: [],
                task: "",
                taskTags: [],
              }
            : {
                id: id || "",
                alias: aliasName,
                gitTag,
                remotePath: "",
                ...(variants && tranformVariants(variants)),
                ...(tasks && transformTasks(tasks)),
              };
        }
        return {
          id: id || "",
          alias: alias || aliasName,
          ...(variants && tranformVariants(variants)),
          ...(tasks && transformTasks(tasks)),
          gitTag: "",
          remotePath: "",
        };
      })
    : [];

type AliasRowUIParams = {
  accordionTitle: string;
  addButtonText?: string;
  aliasHidden?: boolean;
  isRepo?: boolean;
  useAccordion?: boolean;
  useExpandableCard?: boolean;
};

const baseProps = {
  alias: {
    schema: {
      type: "string" as "string",
      title: "Alias Name",
    },
    uiSchema: {
      "ui:data-cy": "alias-input",
    },
  },
  gitTag: {
    schema: {
      type: "string" as "string",
      title: "Git Tag Regex",
    },
  },
  remotePath: {
    schema: {
      type: "string" as "string",
      title: "Config File",
    },
  },
  task: {
    schema: {
      type: "string" as "string",
      default: "",
    },
    uiSchema: {
      "ui:ariaLabelledBy": "task-input-control",
      "ui:data-cy": "task-input",
      "ui:placeholder": "Golang Regex",
    },
  },
  taskTags: {
    schema: {
      type: "array" as "array",
      items: {
        type: "string" as "string",
        title: "Task Tag",
        default: "",
      },
    },
    uiSchema: {
      "ui:addButtonSize": "xsmall",
      "ui:addButtonText": "Add Task Tag",
      "ui:fullWidth": true,
      "ui:showLabel": false,
      "ui:topAlignDelete": true,
      items: {
        "ui:ariaLabelledBy": "variant-input-control",
        "ui:data-cy": "task-tags-input",
      },
    },
  },
  variant: {
    schema: {
      type: "string" as "string",
      default: "",
    },
    uiSchema: {
      "ui:ariaLabelledBy": "variant-input-control",
      "ui:data-cy": "variant-input",
      "ui:placeholder": "Golang Regex",
    },
  },
  variantTags: {
    schema: {
      type: "array" as "array",
      title: "Variant Tags",
      items: {
        type: "string" as "string",
        title: "Variant Tag",
        default: "",
      },
    },
    uiSchema: {
      "ui:addButtonSize": "xsmall",
      "ui:addButtonText": "Add Variant Tag",
      "ui:fullWidth": true,
      "ui:showLabel": false,
      "ui:topAlignDelete": true,
      items: {
        "ui:ariaLabelledBy": "variant-input-control",
        "ui:data-cy": "variant-tags-input",
      },
    },
  },
};

const {
  alias,
  gitTag,
  remotePath,
  task,
  taskTags,
  variant,
  variantTags,
} = baseProps;

const variants = {
  schema: {
    type: "object" as "object",
    title: "",
    properties: {
      specifier: {
        type: "string" as "string",
        title: "Variant",
        default: VariantTaskSpecifier.Tags,
        oneOf: [
          {
            type: "string" as "string",
            title: "Tags",
            enum: [VariantTaskSpecifier.Tags],
          },
          {
            type: "string" as "string",
            title: "Regex",
            enum: [VariantTaskSpecifier.Regex],
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
                enum: [VariantTaskSpecifier.Tags],
              },
              variantTags: variantTags.schema,
            },
          },
          {
            properties: {
              specifier: {
                enum: [VariantTaskSpecifier.Regex],
              },
              variant: variant.schema,
            },
          },
        ],
      },
    },
  },
  uiSchema: {
    specifier: {
      "ui:widget": widgets.SegmentedControlWidget,
    },
    variant: variant.uiSchema,
    variantTags: variantTags.uiSchema,
  },
};

const tasks = {
  schema: {
    type: "object" as "object",
    title: "",
    properties: {
      specifier: {
        type: "string" as "string",
        title: "Task",
        default: VariantTaskSpecifier.Tags,
        oneOf: [
          {
            type: "string" as "string",
            title: "Tags",
            enum: [VariantTaskSpecifier.Tags],
          },
          {
            type: "string" as "string",
            title: "Regex",
            enum: [VariantTaskSpecifier.Regex],
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
                enum: [VariantTaskSpecifier.Tags],
              },
              taskTags: taskTags.schema,
            },
          },
          {
            properties: {
              specifier: {
                enum: [VariantTaskSpecifier.Regex],
              },
              task: task.schema,
            },
          },
        ],
      },
    },
  },
  uiSchema: {
    specifier: {
      "ui:widget": widgets.SegmentedControlWidget,
    },
    task: task.uiSchema,
    taskTags: taskTags.uiSchema,
  },
};

export const gitTagArray = {
  schema: {
    type: "array" as "array",
    items: {
      type: "object" as "object",
      properties: {
        gitTag: gitTag.schema,
        specifier: {
          type: "string" as "string",
          title: "Specify Via",
          default: GitTagSpecifier.ConfigFile,
          oneOf: [
            {
              type: "string" as "string",
              title: "Config File",
              enum: [GitTagSpecifier.ConfigFile],
            },
            {
              type: "string" as "string",
              title: "Variant Tags",
              enum: [GitTagSpecifier.VariantTask],
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
                  enum: [GitTagSpecifier.ConfigFile],
                },
                remotePath: remotePath.schema,
              },
            },
            {
              properties: {
                specifier: {
                  enum: [GitTagSpecifier.VariantTask],
                },
                variants: variants.schema,
                tasks: tasks.schema,
              },
            },
          ],
        },
      },
    },
  },
  uiSchema: {
    "ui:addButtonText": "Add Git Tag",
    "ui:showLabel": false,
    "ui:topAlignDelete": true,
    items: {
      "ui:ObjectFieldTemplate": AccordionFieldTemplate,
      "ui:numberedTitle": "Git Tag",
      specifier: {
        "ui:widget": widgets.SegmentedControlWidget,
      },
      variants: variants.uiSchema,
      tasks: tasks.uiSchema,
    },
  },
};

export const aliasArray = {
  schema: {
    type: "array" as "array",
    items: {
      type: "object" as "object",
      properties: {
        variants: variants.schema,
        tasks: tasks.schema,
      },
    },
  },
  uiSchema: {},
};

export const aliasRowUiSchema = ({
  accordionTitle = "Definition",
  addButtonText,
  aliasHidden = true,
  isRepo = false,
  useExpandableCard = false,
}: AliasRowUIParams) => ({
  "ui:showLabel": false,
  "ui:topAlignDelete": true,
  "ui:useExpandableCard": useExpandableCard,
  ...(useExpandableCard && { "ui:fullWidth": true }),
  ...(addButtonText && { "ui:addButtonText": addButtonText }),
  ...(isRepo && { "ui:readonly": true }),
  items: {
    "ui:ObjectFieldTemplate": AccordionFieldTemplate,
    "ui:numberedTitle": accordionTitle,
    "ui:useExpandableCard": useExpandableCard,
    ...(!aliasHidden && { alias: alias.uiSchema }),
    variants: variants.uiSchema,
    tasks: tasks.uiSchema,
  },
});

export const patchAliasArray = {
  schema: {
    type: "array" as "array",
    items: {
      type: "object" as "object",
      properties: {
        alias: alias.schema,
        variants: variants.schema,
        tasks: tasks.schema,
      },
    },
  },
  uiSchema: aliasRowUiSchema({
    addButtonText: "Add Patch Alias",
    accordionTitle: "New Patch Alias",
    aliasHidden: false,
    useExpandableCard: true,
  }),
  repoData: {
    uiSchema: aliasRowUiSchema({
      accordionTitle: "New Patch Alias",
      aliasHidden: false,
      isRepo: true,
      useExpandableCard: true,
    }),
  },
};
