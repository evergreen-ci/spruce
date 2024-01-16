import { css } from "@emotion/react";
import {
  AccordionFieldTemplate,
  FieldRow,
} from "components/SpruceForm/FieldTemplates";
import { STANDARD_FIELD_WIDTH } from "components/SpruceForm/utils";
import widgets from "components/SpruceForm/Widgets";
import { ProjectAlias, ProjectAliasInput } from "gql/generated/types";

const textAreaCSS = css`
  box-sizing: border-box;
  max-width: ${STANDARD_FIELD_WIDTH}px;
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
  parameters: {
    key: string;
    value: string;
  }[];
};

const aliasToForm = ({
  alias,
  description,
  gitTag,
  id,
  parameters,
  remotePath,
  task,
  taskTags,
  variant,
  variantTags,
}: ProjectAlias): AliasFormType => ({
  id,
  alias,
  description,
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
  parameters,
});

// Bucket aliases according to their "alias" field
export const sortAliases = (
  aliases: ProjectAlias[],
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
    },
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

/**
 * `transformAliases` transforms alias form data into the format expected by GQL.
 * @param aliases - alias form data
 * @param override - whether to override existing aliases
 * @param aliasName - alias name to override
 * @returns - transformed alias form data
 */
export const transformAliases = (
  aliases: AliasFormType[],
  override: boolean,
  aliasName?: AliasNames,
): ProjectAliasInput[] =>
  override
    ? aliases.map((a) => {
        const {
          alias,
          description,
          gitTag,
          id,
          parameters,
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
                parameters,
                taskTags: [],
                variant: "",
                variantTags: [],
              }
            : {
                ...(tasks && transformTasks(tasks)),
                ...(variants && transformVariants(variants)),
                alias: aliasName,
                description: "",
                gitTag,
                parameters,
                id: id || "",
                remotePath: "",
              };
        }
        return {
          ...(tasks && transformTasks(tasks)),
          ...(variants && transformVariants(variants)),
          alias: alias || aliasName,
          description: description || "",
          gitTag: "",
          id: id || "",
          parameters,
          remotePath: "",
        };
      })
    : [];

export const baseProps = {
  alias: {
    schema: {
      type: "string" as "string",
      title: "Alias Name",
      default: "",
      minLength: 1,
    },
    uiSchema: {
      "ui:data-cy": "alias-input",
    },
  },
  description: {
    schema: {
      type: "string" as "string",
      title: "Description",
      default: "",
    },
    uiSchema: {
      "ui:elementWrapperCSS": textAreaCSS,
      "ui:widget": "textarea",
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
    },
  },
  task: {
    schema: {
      type: "string" as "string",
      title: "Task Regex",
      default: "",
      minLength: 1,
    },
    uiSchema: {
      "ui:ariaLabelledBy": "task-input-control",
      "ui:data-cy": "task-input",
      "ui:placeholder": "Golang Regex",
      "ui:sectionId": "task-regex-field",
      "ui:elementWrapperCSS": textAreaCSS,
      "ui:widget": "textarea",
    },
  },
  taskTags: {
    schema: {
      type: "array" as "array",
      minItems: 1,
      items: {
        type: "string" as "string",
        title: "Task Tag",
        default: "",
        minLength: 1,
      },
    },
    uiSchema: {
      "ui:addButtonSize": "xsmall",
      "ui:addButtonText": "Add Task Tag",
      "ui:orderable": false,
      "ui:sectionId": "task-tags-field",
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
      title: "Variant Regex",
      default: "",
      minLength: 1,
    },
    uiSchema: {
      "ui:ariaLabelledBy": "variant-input-control",
      "ui:data-cy": "variant-input",
      "ui:placeholder": "Golang Regex",
      "ui:sectionId": "variant-regex-field",
      "ui:elementWrapperCSS": textAreaCSS,
      "ui:widget": "textarea",
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
      "ui:orderable": false,
      "ui:sectionId": "variant-tags-field",
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
    type: "object" as "object",
    title: "",
    properties: {
      specifier: {
        type: "string" as "string",
        title: "",
        default: VariantTaskSpecifier.Tags,
        oneOf: [
          {
            type: "string" as "string",
            title: "Variant Tags",
            enum: [VariantTaskSpecifier.Tags],
          },
          {
            type: "string" as "string",
            title: "Variant Regex",
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
        title: "",
        default: VariantTaskSpecifier.Tags,
        oneOf: [
          {
            type: "string" as "string",
            title: "Task Tags",
            enum: [VariantTaskSpecifier.Tags],
          },
          {
            type: "string" as "string",
            title: "Task Regex",
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

const parameters = {
  schema: {
    type: "array" as "array",
    title: "Parameters",
    items: {
      type: "object" as "object",
      title: "Parameter",
      properties: {
        key: {
          type: "string" as "string",
          title: "Key",
        },
        value: {
          type: "string" as "string",
          title: "Value",
        },
      },
      required: ["key", "value"],
    },
  },
  uiSchema: {
    "ui:addButtonText": "Add parameter",
    items: {
      "ui:ObjectFieldTemplate": FieldRow,
      "ui:data-cy": "parameter-input",
      key: {
        "ui:placeholder": "Key",
      },
      value: {
        "ui:placeholder": "Value",
      },
    },
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
    "ui:orderable": false,
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
  "ui:showLabel": false,
  "ui:topAlignDelete": true,
  "ui:useExpandableCard": useExpandableCard,
  "ui:orderable": false,
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
    variants: variants.uiSchema,
    tasks: tasks.uiSchema,
    parameters: parameters.uiSchema,
  },
});

export const patchAliasArray = {
  schema: {
    type: "array" as "array",
    items: {
      type: "object" as "object",
      properties: {
        alias: alias.schema,
        description: description.schema,
        variants: variants.schema,
        tasks: tasks.schema,
        parameters: parameters.schema,
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
