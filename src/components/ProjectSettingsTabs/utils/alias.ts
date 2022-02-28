import { ProjectAliasInput } from "gql/generated/types";
import { AliasRow } from "../AliasRow";
import { AliasType } from "./types";

export enum AliasNames {
  CommitQueue = "__commit_queue",
  GithubPr = "__github",
  GithubCheck = "__github_checks",
  GitTag = "__git_tag",
}

const pairHasError = (regex: string, tags: string[]): boolean => {
  const hasInvalidTags =
    !tags || !tags?.length || tags.every((tag) => tag === "");
  return regex === "" && hasInvalidTags;
};

export const aliasHasError = ({
  task,
  taskTags,
  variant,
  variantTags,
}: Partial<AliasType>): boolean =>
  pairHasError(task, taskTags) || pairHasError(variant, variantTags);

// Bucket aliases according to their "alias" field
export const sortAliases = (
  aliases: AliasType[]
): Record<string, AliasType[]> =>
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

// Given alias form data, transform it to be safely saved
export const transformAliases = (
  aliases: Partial<AliasType>[],
  override: boolean,
  aliasName?: AliasNames
): ProjectAliasInput[] =>
  override
    ? aliases.map((a) => {
        if (aliasHasError(a)) {
          return;
        }
        const { id, alias, variant, variantTags, task, taskTags } = a;
        return {
          id: id || "",
          alias: alias || aliasName,
          variant: variant || "",
          variantTags: variantTags?.filter((tag) => tag) ?? [],
          task: task || "",
          taskTags: taskTags?.filter((tag) => tag) ?? [],
          gitTag: "",
          remotePath: "",
        };
      })
    : [];

type AliasRowUIParams = {
  addButtonText?: string;
  aliasHidden?: boolean;
  displayTitle: string;
  isRepo?: boolean;
  useAccordion?: boolean;
  useExpandableCard?: boolean;
};

export const aliasArraySchema = {
  type: "array" as "array",
  items: {
    type: "object" as "object",
    properties: {
      alias: {
        type: "string" as "string",
        title: "Alias Name",
      },
      variant: {
        type: "string" as "string",
        default: "",
      },
      variantTags: {
        type: "array" as "array",
        title: "Variant Tags",
        items: {
          type: "string" as "string",
          title: "Variant Tag",
          default: "",
        },
      },
      task: {
        type: "string" as "string",
        default: "",
      },
      taskTags: {
        type: "array" as "array",
        items: {
          type: "string" as "string",
          title: "Task Tag",
          default: "",
        },
      },
    },
  },
};

export const aliasRowUiSchema = ({
  addButtonText,
  aliasHidden = true,
  displayTitle = "Definition",
  isRepo = false,
  useExpandableCard = false,
}: AliasRowUIParams) => ({
  "ui:showLabel": false,
  "ui:topAlignDelete": true,
  "ui:useExpandableCard": useExpandableCard,
  ...(addButtonText && { "ui:addButtonText": addButtonText }),
  ...(isRepo && {
    "ui:readonly": true,
    "ui:showLabel": false,
  }),
  items: {
    "ui:ObjectFieldTemplate": AliasRow,
    "ui:displayTitle": displayTitle,
    "ui:useAccordion": !useExpandableCard,
    alias: {
      "ui:data-cy": "alias-input",
      ...(aliasHidden && {
        "ui:widget": "hidden",
      }),
    },
    variant: {
      "ui:ariaLabelledBy": "variant-input-control",
      "ui:data-cy": "variant-input",
      "ui:placeholder": "Golang Regex",
    },
    variantTags: {
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
    task: {
      "ui:ariaLabelledBy": "task-input-control",
      "ui:data-cy": "task-input",
      "ui:placeholder": "Golang Regex",
    },
    taskTags: {
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
});
