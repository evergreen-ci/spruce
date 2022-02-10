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
}: AliasType): boolean =>
  pairHasError(task, taskTags) || pairHasError(variant, variantTags);

export const sortAliases = (aliases) =>
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

export const transformAliases = (
  aliases: AliasType[],
  aliasName?: AliasNames
): ProjectAliasInput[] =>
  aliases.map(({ id, alias, variant, variantTags, task, taskTags }) => ({
    id: id || "",
    alias: alias || aliasName,
    variant: variant || "",
    variantTags: variantTags?.filter((tag) => tag) ?? [],
    task: task || "",
    taskTags: taskTags?.filter((tag) => tag) ?? [],
    gitTag: "",
    remotePath: "",
  }));

type AliasRowUIParams = {
  accordionTitle: string;
  addButtonText?: string;
  aliasHidden?: boolean;
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
  ...(isRepo && {
    "ui:readonly": true,
    "ui:showLabel": false,
  }),
  items: {
    "ui:ObjectFieldTemplate": AliasRow,
    "ui:accordionTitle": accordionTitle,
    "ui:useExpandableCard": useExpandableCard,
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
      items: {
        "ui:ariaLabelledBy": "variant-input-control",
        "ui:data-cy": "task-tags-input",
      },
    },
  },
});
