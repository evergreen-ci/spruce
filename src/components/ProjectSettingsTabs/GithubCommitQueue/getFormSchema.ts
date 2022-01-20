import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { AliasRow } from "../AliasRow";
import { overrideRadioBox, radioBoxOptions } from "../utils";
import { FormState } from "./types";

export const getFormSchema = (
  useRepoSettings: boolean,
  gitHubWebhooksEnabled: boolean,
  formData: FormState,
  repoData?: FormState
): {
  fields: Record<string, Field>;
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  fields: {},
  schema: {
    definitions: {
      aliasArray: {
        type: "array" as "array",
        items: {
          type: "object" as "object",
          properties: {
            id: {
              type: "string" as "string",
            },
            alias: {
              type: "string" as "string",
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
      },
    },
    type: "object" as "object",
    properties: {
      github: {
        type: "object" as "object",
        title: "GitHub",
        properties: {
          gitHubWebhooksEnabled: {
            type: "null",
            title: "GitHub Webhooks",
            description: `GitHub webhooks ${
              gitHubWebhooksEnabled ? "are" : "aren't"
            } enabled.`,
          },
          prTestingEnabledTitle: {
            type: "null",
            title: "GitHub Pull Request Testing",
            ...(useRepoSettings === undefined && {
              description:
                "If enabled, then untracked branches will also use the file patterns defined here for PR testing.",
            }),
          },
          prTestingEnabled: {
            type: ["boolean", "null"],
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.github?.prTestingEnabled
            ),
          },
          prTesting: {
            type: "object" as "object",
            title: "GitHub Patch Definitions",
            description:
              "For patches created from GitHub pull requests, Evergreen will find variants that match each variant regex, and schedule tasks that match the corresponding task regex. All regular expressions must be valid Golang regular expressions.",
            ...overrideRadioBox(
              "githubPrAliases",
              [
                "Override Repo Patch Definition",
                "Default to Repo Patch Definition",
              ],
              {
                $ref: "#/definitions/aliasArray",
              }
            ),
          },
          githubChecksEnabledTitle: {
            type: "null",
            title: "GitHub Commit Checks",
            description:
              "Commits will send their status as a Github Check (the check will pass/fail based only on the tasks matching the tags/regexes definitions).",
          },
          githubChecksEnabled: {
            type: ["boolean", "null"],
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.github?.githubChecksEnabled
            ),
          },
          githubChecks: {
            title: "Commit Check Definitions",
            ...overrideRadioBox(
              "githubCheckAliases",
              ["Override Repo Definition", "Default to Repo Definition"],
              {
                $ref: "#/definitions/aliasArray",
              }
            ),
          },
          gitTagVersionsTitle: {
            type: "null",
            title: "Trigger Versions With Git Tags",
          },
          gitTagVersionsEnabled: {
            type: ["boolean", "null"],
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.github?.gitTagVersionsEnabled
            ),
          },
          users: {
            title: "Authorized Users",
            description:
              "MANA entitlements may also be used to manage this authorization.",
            ...overrideRadioBox(
              "gitTagAuthorizedUsers",
              ["Override Repo Users", "Default to Repo Users"],
              {
                type: ["array", "null"],
                items: {
                  type: "string" as "string",
                  title: "Username",
                  default: "",
                },
              }
            ),
          },
          teams: {
            title: "Authorized Teams",
            description:
              "This should be the team slug, i.e. the team name with dashes instead of spaces. For example, the team Evergreen Users would be evergreen-users. MANA entitlements may also be used to manage this authorization.",
            ...overrideRadioBox(
              "gitTagAuthorizedTeams",
              ["Override Repo Teams", "Default to Repo Teams"],
              {
                type: ["array", "null"],
                items: {
                  type: "string" as "string",
                  title: "Team",
                  default: "",
                },
              }
            ),
          },
          gitTagVersions: {
            type: "null",
            title: "Git Tag Version Definitions",
            description: "TODO: EVG-16117",
          },
        },
      },
    },
  },
  uiSchema: {
    github: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      prTestingEnabledTitle: {
        "ui:sectionTitle": true,
      },
      prTestingEnabled: {
        "ui:showLabel": false,
        "ui:widget": widgets.RadioBoxWidget,
      },
      prTesting: {
        "ui:disabled": useRepoSettings
          ? !repoData?.github?.prTestingEnabled
          : !formData?.github?.prTestingEnabled,
        githubPrAliasesOverride: {
          ...overrideStyling(repoData?.github?.prTesting?.githubPrAliases),
        },
        githubPrAliases: {
          ...aliasRowUiSchema({
            addButtonText: "Add Patch Definition",
            accordionTitle: "Patch Definition",
          }),
        },
        repoData: {
          githubPrAliases: {
            ...aliasRowUiSchema({
              accordionTitle: "Patch Definition",
              isRepo: true,
            }),
          },
        },
      },
      githubChecksEnabledTitle: {
        "ui:sectionTitle": true,
      },
      githubChecksEnabled: {
        "ui:showLabel": false,
        "ui:widget": widgets.RadioBoxWidget,
      },
      githubChecks: {
        "ui:disabled": !formData?.github?.githubChecksEnabled,
        githubCheckAliasesOverride: {
          ...overrideStyling(
            repoData?.github?.githubChecks?.githubCheckAliases
          ),
        },
        githubCheckAliases: {
          ...aliasRowUiSchema({
            addButtonText: "Add Definition",
            accordionTitle: "Commit Check Definition",
          }),
        },
        repoData: {
          githubCheckAliases: {
            ...aliasRowUiSchema({
              accordionTitle: "Commit Check Definition",
              isRepo: true,
            }),
          },
        },
      },
      gitTagVersionsTitle: {
        "ui:sectionTitle": true,
      },
      gitTagVersionsEnabled: {
        "ui:showLabel": false,
        "ui:widget": widgets.RadioBoxWidget,
      },
      users: {
        "ui:disabled": !formData?.github?.gitTagVersionsEnabled,
        gitTagAuthorizedUsersOverride: {
          ...overrideStyling(repoData?.github?.users?.gitTagAuthorizedUsers),
        },
        gitTagAuthorizedUsers: {
          "ui:addButtonText": "Add User",
          "ui:showLabel": false,
        },
        repoData: {
          gitTagAuthorizedUsers: {
            "ui:readonly": true,
            "ui:showLabel": false,
          },
        },
      },
      teams: {
        "ui:disabled": !formData?.github?.gitTagVersionsEnabled,
        gitTagAuthorizedTeamsOverride: {
          ...overrideStyling(repoData?.github?.teams?.gitTagAuthorizedTeams),
        },
        gitTagAuthorizedTeams: {
          "ui:addButtonText": "Add Team",
          "ui:showLabel": false,
        },
        repoData: {
          gitTagAuthorizedTeams: {
            "ui:readonly": true,
            "ui:showLabel": false,
          },
        },
      },
    },
  },
});

const overrideStyling = (field) => ({
  "ui:widget": field === undefined ? "hidden" : widgets.RadioBoxWidget,
  "ui:showLabel": false,
});

type AliasRowUIParams = {
  accordionTitle: string;
  addButtonText?: string;
  isRepo?: boolean;
};

const aliasRowUiSchema = ({
  accordionTitle = "Definition",
  addButtonText,
  isRepo = false,
}: AliasRowUIParams) => ({
  "ui:showLabel": false,
  "ui:topAlignDelete": true,
  ...(addButtonText && { "ui:addButtonText": addButtonText }),
  ...(isRepo && {
    "ui:readonly": true,
    "ui:showLabel": false,
  }),
  items: {
    "ui:ObjectFieldTemplate": AliasRow,
    "ui:accordionTitle": accordionTitle,
    id: {
      "ui:widget": "hidden",
    },
    alias: {
      "ui:widget": "hidden",
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
