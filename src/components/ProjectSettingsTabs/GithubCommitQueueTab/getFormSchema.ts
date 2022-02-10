import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { alias, form } from "../utils";
import { FormState } from "./types";

const { aliasArraySchema, aliasRowUiSchema } = alias;
const { insertIf, overrideRadioBox, placeholderIf, radioBoxOptions } = form;

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
      aliasArray: aliasArraySchema,
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
              gitHubWebhooksEnabled ? "are" : "are not"
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
              "For patches created from GitHub pull requests, Evergreen will schedule only the tasks and variants matching the tags/regex definitions. All regular expressions must be valid Golang regular expressions.",
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
      commitQueue: {
        type: "object" as "object",
        title: "Commit Queue",
        properties: {
          enabled: {
            type: ["boolean", "null"],
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.commitQueue?.enabled
            ),
          },
          requireSigned: {
            type: ["boolean", "null"],
            title: "Require Signed Commits on Pull Request Merges",
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.commitQueue?.requireSigned
            ),
          },
          message: {
            type: "string" as "string",
            title: "Commit Queue Message",
          },
          mergeMethod: {
            type: ["string"],
            title: "Merge Method",
            oneOf: [
              {
                type: "string" as "string",
                title: "Squash",
                enum: ["squash"],
              },
              {
                type: "string" as "string",
                title: "Merge",
                enum: ["merge"],
              },
              {
                type: "string" as "string",
                title: "Rebase",
                enum: ["rebase"],
              },
              ...insertIf(repoData, {
                type: "string" as "string",
                title: `Default to Repo (${repoData?.commitQueue?.mergeMethod})`,
                enum: [""],
              }),
            ],
          },
          patchDefinitions: {
            type: "object" as "object",
            title: "Commit Queue Patch Definitions",
            description:
              "Changes on the Commit Queue are tested with all variants and tasks that match each variant and task regex pair.",
            ...overrideRadioBox(
              "commitQueueAliases",
              [
                "Override Repo Patch Definition",
                "Default to Repo Patch Definition",
              ],
              {
                $ref: "#/definitions/aliasArray",
              }
            ),
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
        ...hideIf(
          formData?.github?.prTestingEnabled,
          repoData?.github?.prTestingEnabled
        ),
        githubPrAliasesOverride: {
          ...overrideStyling(
            repoData?.github?.prTesting?.githubPrAliases === undefined
          ),
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
        ...hideIf(
          formData?.github?.githubChecksEnabled,
          repoData?.github?.githubChecksEnabled
        ),
        githubCheckAliasesOverride: {
          ...overrideStyling(
            repoData?.github?.githubChecks?.githubCheckAliases === undefined
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
        ...userTeamStyling(
          "gitTagAuthorizedUsers",
          "Add User",
          repoData?.github?.users?.gitTagAuthorizedUsers === undefined,
          formData?.github?.gitTagVersionsEnabled,
          repoData?.github?.gitTagVersionsEnabled
        ),
      },
      teams: {
        ...userTeamStyling(
          "gitTagAuthorizedTeams",
          "Add Team",
          repoData?.github?.teams?.gitTagAuthorizedTeams === undefined,
          formData?.github?.gitTagVersionsEnabled,
          repoData?.github?.gitTagVersionsEnabled
        ),
      },
    },
    commitQueue: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:data-cy": "cq-card",
      enabled: {
        "ui:showLabel": false,
        "ui:widget": widgets.RadioBoxWidget,
        "ui:data-cy": "cq-enabled-radio-box",
      },
      requireSigned: {
        "ui:widget": widgets.RadioBoxWidget,
        ...(formData?.commitQueue?.enabled === false && { "ui:hide": true }),
      },
      message: {
        "ui:description": "Shown in commit queue CLI commands & web UI",
        "ui:data-cy": "cq-message-input",
        ...placeholderIf(repoData?.commitQueue?.message),
        ...hideIf(
          formData?.commitQueue?.enabled,
          repoData?.commitQueue?.enabled
        ),
      },
      mergeMethod: {
        "ui:allowDeselect": false,
        "ui:data-cy": "merge-method-select",
        ...hideIf(
          formData?.commitQueue?.enabled,
          repoData?.commitQueue?.enabled
        ),
      },
      patchDefinitions: {
        ...hideIf(
          formData?.commitQueue?.enabled,
          repoData?.commitQueue?.enabled
        ),
        commitQueueAliasesOverride: {
          "ui:data-cy": "cq-override-radio-box",
          ...overrideStyling(
            repoData?.commitQueue?.patchDefinitions?.commitQueueAliases ===
              undefined
          ),
        },
        commitQueueAliases: {
          ...aliasRowUiSchema({
            addButtonText: "Add Patch Definition",
            accordionTitle: "Patch Definition",
          }),
        },
        repoData: {
          commitQueueAliases: {
            ...aliasRowUiSchema({
              accordionTitle: "Patch Definition",
              isRepo: true,
            }),
          },
        },
      },
    },
  },
});

const hideIf = (field: boolean | null, repoField: boolean | null) =>
  (field === false || (field === null && repoField === false)) && {
    "ui:widget": "hidden",
  };

const overrideStyling = (isMissingRepoField: boolean) => ({
  "ui:widget": isMissingRepoField ? "hidden" : widgets.RadioBoxWidget,
  "ui:showLabel": false,
});

const userTeamStyling = (
  fieldName: string,
  addButtonText: string,
  shouldOverride: boolean,
  field: boolean | null,
  repoField: boolean | null
) => ({
  ...hideIf(field, repoField),
  [`${fieldName}Override`]: {
    ...overrideStyling(shouldOverride),
  },
  [fieldName]: {
    "ui:addButtonText": addButtonText,
    "ui:showLabel": false,
  },
  repoData: {
    [fieldName]: {
      "ui:disabled": true,
      "ui:readonly": true,
      "ui:showLabel": false,
    },
  },
});
