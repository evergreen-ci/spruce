import { css } from "@emotion/react";
import { AccordionFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { ProjectAlias, ProjectAliasInput } from "gql/generated/types";

const textAreaCSS = css`
  box-sizing: border-box;
  max-width: 400px;
`;

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
  description: string;
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
  alias,
  description,
  gitTag,
  id,
  remotePath,
  task,
  taskTags,
  variant,
  variantTags,
}: ProjectAlias): AliasFormType => ({
  alias,
  description,
  gitTag,
  id,
  remotePath,
  tasks: {
    specifier: task ? VariantTaskSpecifier.Regex : VariantTaskSpecifier.Tags,
    task,
    taskTags,
  },
  variants: {
    specifier: variant ? VariantTaskSpecifier.Regex : VariantTaskSpecifier.Tags,
    variant,
    variantTags,
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
      gitTagAliases: [],
      githubCheckAliases: [],
      githubPrAliases: [],
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
        const {
          alias,
          description,
          gitTag,
          id,
          remotePath,
          specifier,
          tasks,
          variants,
        } = a;
        if (aliasName === AliasNames.GitTag) {
          return specifier === GitTagSpecifier.ConfigFile
            ? {
                alias: aliasName,
                description: "",
                gitTag,
                id: id || "",
                remotePath,
                task: "",
                taskTags: [],
                variant: "",
                variantTags: [],
              }
            : {
                alias: aliasName,
                description: "",
                gitTag,
                id: id || "",
                remotePath: "",
                ...(variants && transformVariants(variants)),
                ...(tasks && transformTasks(tasks)),
              };
        }
        return {
          alias: alias || aliasName,
          description: description || "",
          id: id || "",
          ...(variants && transformVariants(variants)),
          ...(tasks && transformTasks(tasks)),
          gitTag: "",
          remotePath: "",
        };
      })
    : [];

export const baseProps = {
  alias: {
    schema: {
      default: "",
      minLength: 1,
      title: "Alias Name",
      type: "string" as "string",
    },
    uiSchema: {
      "ui:data-cy": "alias-input",
    },
  },
  description: {
    schema: {
      default: "",
      title: "Description",
      type: "string" as "string",
    },
    uiSchema: {
      "ui:elementWrapperCSS": textAreaCSS,
      "ui:widget": "textarea",
    },
  },
  gitTag: {
    schema: {
      default: "",
      minLength: 1,
      title: "Git Tag Regex",
      type: "string" as "string",
    },
    uiSchema: {
      "ui:data-cy": "git-tag-input",
    },
  },
  remotePath: {
    schema: {
      default: "",
      minLength: 1,
      title: "Config File",
      type: "string" as "string",
    },
    uiSchema: {
      "ui:data-cy": "remote-path-input",
      "ui:sectionId": "remote-path-field",
    },
  },
  task: {
    schema: {
      default: "",
      minLength: 1,
      title: "Task Regex",
      type: "string" as "string",
    },
    uiSchema: {
      "ui:ariaLabelledBy": "task-input-control",
      "ui:data-cy": "task-input",
      "ui:elementWrapperCSS": textAreaCSS,
      "ui:placeholder": "Golang Regex",
      "ui:sectionId": "task-regex-field",
      "ui:widget": "textarea",
    },
  },
  taskTags: {
    schema: {
      items: {
        default: "",
        minLength: 1,
        title: "Task Tag",
        type: "string" as "string",
      },
      minItems: 1,
      type: "array" as "array",
    },
    uiSchema: {
      items: {
        "ui:ariaLabelledBy": "variant-input-control",
        "ui:data-cy": "task-tags-input",
      },
      "ui:addButtonSize": "xsmall",
      "ui:addButtonText": "Add Task Tag",
      "ui:fullWidth": true,
      "ui:orderable": false,
      "ui:sectionId": "task-tags-field",
      "ui:showLabel": false,
      "ui:topAlignDelete": true,
    },
  },
  variant: {
    schema: {
      default: "",
      minLength: 1,
      title: "Variant Regex",
      type: "string" as "string",
    },
    uiSchema: {
      "ui:ariaLabelledBy": "variant-input-control",
      "ui:data-cy": "variant-input",
      "ui:elementWrapperCSS": textAreaCSS,
      "ui:placeholder": "Golang Regex",
      "ui:sectionId": "variant-regex-field",
      "ui:widget": "textarea",
    },
  },
  variantTags: {
    schema: {
      items: {
        default: "",
        minLength: 1,
        title: "Variant Tag",
        type: "string" as "string",
      },
      minItems: 1,
      title: "Variant Tags",
      type: "array" as "array",
    },
    uiSchema: {
      items: {
        "ui:ariaLabelledBy": "variant-input-control",
        "ui:data-cy": "variant-tags-input",
      },
      "ui:addButtonSize": "xsmall",
      "ui:addButtonText": "Add Variant Tag",
      "ui:fullWidth": true,
      "ui:orderable": false,
      "ui:sectionId": "variant-tags-field",
      "ui:showLabel": false,
      "ui:topAlignDelete": true,
    },
  },
};

const {
  alias,
  description,
  gitTag,
  remotePath,
  task,
  taskTags,
  variant,
  variantTags,
} = baseProps;

const variants = {
  schema: {
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
    properties: {
      specifier: {
        default: VariantTaskSpecifier.Tags,
        oneOf: [
          {
            enum: [VariantTaskSpecifier.Tags],
            title: "Variant Tags",
            type: "string" as "string",
          },
          {
            enum: [VariantTaskSpecifier.Regex],
            title: "Variant Regex",
            type: "string" as "string",
          },
        ],
        title: "",
        type: "string" as "string",
      },
    },
    title: "",
    type: "object" as "object",
  },
  uiSchema: {
    specifier: {
      "ui:aria-controls": ["variant-regex-field", "variant-tags-field"],
      "ui:data-cy": "variant-input-control",
      "ui:sectionId": "variant-task-field",
      "ui:widget": widgets.SegmentedControlWidget,
    },
    variant: variant.uiSchema,
    variantTags: variantTags.uiSchema,
  },
};

const tasks = {
  schema: {
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
    properties: {
      specifier: {
        default: VariantTaskSpecifier.Tags,
        oneOf: [
          {
            enum: [VariantTaskSpecifier.Tags],
            title: "Task Tags",
            type: "string" as "string",
          },
          {
            enum: [VariantTaskSpecifier.Regex],
            title: "Task Regex",
            type: "string" as "string",
          },
        ],
        title: "",
        type: "string" as "string",
      },
    },
    title: "",
    type: "object" as "object",
  },
  uiSchema: {
    specifier: {
      "ui:aria-controls": ["task-regex-field", "task-tags-field"],
      "ui:data-cy": "task-input-control",
      "ui:widget": widgets.SegmentedControlWidget,
    },
    task: task.uiSchema,
    taskTags: taskTags.uiSchema,
  },
};

export const gitTagArray = {
  schema: {
    items: {
      dependencies: {
        specifier: {
          oneOf: [
            {
              properties: {
                remotePath: remotePath.schema,
                specifier: {
                  enum: [GitTagSpecifier.ConfigFile],
                },
              },
            },
            {
              properties: {
                specifier: {
                  enum: [GitTagSpecifier.VariantTask],
                },
                tasks: tasks.schema,
                variants: variants.schema,
              },
            },
          ],
        },
      },
      properties: {
        gitTag: gitTag.schema,
        specifier: {
          default: GitTagSpecifier.ConfigFile,
          oneOf: [
            {
              enum: [GitTagSpecifier.ConfigFile],
              title: "Config File",
              type: "string" as "string",
            },
            {
              enum: [GitTagSpecifier.VariantTask],
              title: "Variant/Task",
              type: "string" as "string",
            },
          ],
          title: "Specify Via",
          type: "string" as "string",
        },
      },
      type: "object" as "object",
    },
    type: "array" as "array",
  },
  uiSchema: {
    items: {
      gitTag: gitTag.uiSchema,
      remotePath: remotePath.uiSchema,
      specifier: {
        "ui:aria-controls": ["variant-task-field", "remote-path-field"],
        "ui:widget": widgets.SegmentedControlWidget,
      },
      tasks: tasks.uiSchema,
      "ui:ObjectFieldTemplate": AccordionFieldTemplate,
      "ui:numberedTitle": "Git Tag",
      variants: variants.uiSchema,
    },
    "ui:addButtonText": "Add Git Tag",
    "ui:orderable": false,
    "ui:showLabel": false,
    "ui:topAlignDelete": true,
  },
};

export const aliasArray = {
  schema: {
    items: {
      properties: {
        tasks: tasks.schema,
        variants: variants.schema,
      },
      type: "object" as "object",
    },
    type: "array" as "array",
  },
  uiSchema: {
    "ui:orderable": false,
  },
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
  "ui:orderable": false,
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
    ...(!aliasHidden && {
      alias: alias.uiSchema,
      description: description.uiSchema,
    }),
    tasks: tasks.uiSchema,
    variants: variants.uiSchema,
  },
});

export const patchAliasArray = {
  repoData: {
    uiSchema: aliasRowUiSchema({
      aliasHidden: false,
      displayTitle: "New Patch Alias",
      isRepo: true,
      useExpandableCard: true,
    }),
  },
  schema: {
    items: {
      properties: {
        alias: alias.schema,
        description: description.schema,
        tasks: tasks.schema,
        variants: variants.schema,
      },
      type: "object" as "object",
    },
    type: "array" as "array",
  },
  uiSchema: aliasRowUiSchema({
    addButtonText: "Add Patch Alias",
    aliasHidden: false,
    displayTitle: "New Patch Alias",
    useExpandableCard: true,
  }),
};
