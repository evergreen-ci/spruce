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

export type AliasFormType = {
  id: string;
  alias: string;
  displayTitle?: string;
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

const aliasToForm = ({
  id,
  alias,
  gitTag,
  remotePath,
  variant,
  variantTags,
  task,
  taskTags,
}: ProjectAlias): AliasFormType => ({
  id,
  alias,
  gitTag,
  remotePath,
  variants: {
    specifier: variant ? VariantTaskSpecifier.Regex : VariantTaskSpecifier.Tags,
    variant,
    variantTags,
  },
  tasks: {
    specifier: task ? VariantTaskSpecifier.Regex : VariantTaskSpecifier.Tags,
    task,
    taskTags,
  },
  ...(alias === AliasNames.GitTag && {
    specifier: remotePath
      ? GitTagSpecifier.ConfigFile
      : GitTagSpecifier.VariantTask,
  }),
  ...(!Object.values(AliasNames).includes(alias as AliasNames) && {
    displayTitle: alias,
  }),
});

// Bucket aliases according to their "alias" field
export const sortAliases = (
  aliases: ProjectAlias[]
): Record<string, AliasFormType[]> =>
  aliases.reduce(
    (o, a) => {
      const transformedAlias = aliasToForm(a);
      if (a.alias === AliasNames.GithubPr) {
        o.githubPrAliases.push(transformedAlias);
      } else if (a.alias === AliasNames.GithubCheck) {
        o.githubCheckAliases.push(transformedAlias);
      } else if (a.alias === AliasNames.GitTag) {
        o.gitTagAliases.push(transformedAlias);
      } else if (a.alias === AliasNames.CommitQueue) {
        o.commitQueueAliases.push(transformedAlias);
      } else {
        o.patchAliases.push(transformedAlias);
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

const transformVariants = ({
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

// Given alias form data, transform it to be safely saved
export const transformAliases = (
  aliases: AliasFormType[],
  override: boolean,
  aliasName?: AliasNames
): ProjectAliasInput[] =>
  override
    ? aliases.map((a) => {
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
                ...(variants && transformVariants(variants)),
                ...(tasks && transformTasks(tasks)),
              };
        }
        return {
          id: id || "",
          alias: alias || aliasName,
          ...(variants && transformVariants(variants)),
          ...(tasks && transformTasks(tasks)),
          gitTag: "",
          remotePath: "",
        };
      })
    : [];

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
      default: "",
      minLength: 1,
    },
    uiSchema: {
      "ui:data-cy": "git-tag-input",
      "ui:showErrors": false,
    },
  },
  remotePath: {
    schema: {
      type: "string" as "string",
      title: "Config File",
      default: "",
      minLength: 1,
    },
    uiSchema: {
      "ui:data-cy": "remote-path-input",
      "ui:sectionId": "remote-path-field",
      "ui:showErrors": false,
    },
  },
  task: {
    schema: {
      type: "string" as "string",
      default: "",
      minLength: 1,
    },
    uiSchema: {
      "ui:ariaLabelledBy": "task-input-control",
      "ui:data-cy": "task-input",
      "ui:placeholder": "Golang Regex",
      "ui:sectionId": "task-regex-field",
      "ui:showErrors": false,
    },
  },
  taskTags: {
    schema: {
      type: "array" as "array",
      minItems: 1,
      items: {
        type: "string" as "string",
        title: "Task Tag",
        minLength: 1,
      },
    },
    uiSchema: {
      "ui:addButtonSize": "xsmall",
      "ui:addButtonText": "Add Task Tag",
      "ui:fullWidth": true,
      "ui:sectionId": "task-tags-field",
      "ui:showLabel": false,
      "ui:topAlignDelete": true,
      items: {
        "ui:ariaLabelledBy": "variant-input-control",
        "ui:data-cy": "task-tags-input",
        "ui:showErrors": false,
      },
    },
  },
  variant: {
    schema: {
      type: "string" as "string",
      default: "",
      minLength: 1,
    },
    uiSchema: {
      "ui:ariaLabelledBy": "variant-input-control",
      "ui:data-cy": "variant-input",
      "ui:placeholder": "Golang Regex",
      "ui:sectionId": "variant-regex-field",
      "ui:showErrors": false,
    },
  },
  variantTags: {
    schema: {
      type: "array" as "array",
      title: "Variant Tags",
      minItems: 1,
      items: {
        type: "string" as "string",
        title: "Variant Tag",
        default: "",
        minLength: 1,
      },
    },
    uiSchema: {
      "ui:addButtonSize": "xsmall",
      "ui:addButtonText": "Add Variant Tag",
      "ui:fullWidth": true,
      "ui:sectionId": "variant-tags-field",
      "ui:showLabel": false,
      "ui:topAlignDelete": true,
      items: {
        "ui:ariaLabelledBy": "variant-input-control",
        "ui:data-cy": "variant-tags-input",
        "ui:showErrors": false,
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
      "ui:data-cy": "variant-input-control",
      "ui:sectionId": "variant-task-field",
      "ui:aria-controls": ["variant-regex-field", "variant-tags-field"],
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
      "ui:data-cy": "task-input-control",
      "ui:aria-controls": ["task-regex-field", "task-tags-field"],
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
              title: "Variant/Task",
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
      remotePath: remotePath.uiSchema,
      gitTag: gitTag.uiSchema,
      specifier: {
        "ui:widget": widgets.SegmentedControlWidget,
        "ui:aria-controls": ["variant-task-field", "remote-path-field"],
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

type AliasRowUIParams = {
  addButtonText?: string;
  aliasHidden?: boolean;
  displayTitle?: string;
  numberedTitle?: string;
  isRepo?: boolean;
  useExpandableCard?: boolean;
};

export const aliasRowUiSchema = ({
  addButtonText,
  aliasHidden = true,
  displayTitle,
  isRepo = false,
  numberedTitle,
  useExpandableCard = false,
}: AliasRowUIParams) => ({
  "ui:showLabel": false,
  "ui:topAlignDelete": true,
  "ui:useExpandableCard": useExpandableCard,
  ...(addButtonText && { "ui:addButtonText": addButtonText }),
  ...(isRepo && { "ui:readonly": true }),
  items: {
    ...(!useExpandableCard && {
      "ui:ObjectFieldTemplate": AccordionFieldTemplate,
    }),
    ...(displayTitle && { "ui:displayTitle": displayTitle }),
    ...(numberedTitle && { "ui:numberedTitle": numberedTitle }),
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
    displayTitle: "New Patch Alias",
    aliasHidden: false,
    useExpandableCard: true,
  }),
  repoData: {
    uiSchema: aliasRowUiSchema({
      aliasHidden: false,
      displayTitle: "New Patch Alias",
      isRepo: true,
      useExpandableCard: true,
    }),
  },
};
