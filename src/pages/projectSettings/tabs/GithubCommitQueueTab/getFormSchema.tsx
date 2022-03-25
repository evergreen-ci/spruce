import { Description } from "@leafygreen-ui/typography";
import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { StyledRouterLink } from "components/styles";
import {
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
} from "constants/routes";
import { getTabTitle } from "pages/projectSettings/getTabTitle";
import { alias, form, ProjectType } from "../utils";
import { GithubTriggerAliasField } from "./GithubTriggerAliasField";
import { FormState } from "./types";

const { aliasArray, aliasRowUiSchema, gitTagArray } = alias;
const { insertIf, overrideRadioBox, placeholderIf, radioBoxOptions } = form;

export const getFormSchema = (
  identifier: string,
  projectType: ProjectType,
  githubWebhooksEnabled: boolean,
  formData: FormState,
  repoData?: FormState
): {
  fields: Record<string, Field>;
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => {
  const overrideStyling = {
    "ui:widget":
      projectType === ProjectType.AttachedProject
        ? widgets.RadioBoxWidget
        : "hidden",
    "ui:showLabel": false,
  };

  return {
    fields: {
      githubTriggerAliasField: GithubTriggerAliasField,
    },
    schema: {
      type: "object" as "object",
      properties: {
        github: {
          type: "object" as "object",
          title: "GitHub",
          properties: {
            githubWebhooksEnabled: {
              type: "null",
              title: "GitHub Webhooks",
              description: `GitHub webhooks ${
                githubWebhooksEnabled ? "are" : "are not"
              } enabled.`,
            },
            prTestingEnabledTitle: {
              type: "null",
              title: "GitHub Pull Request Testing",
              ...(projectType === ProjectType.Repo && {
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
                aliasArray.schema
              ),
            },
            githubTriggerAliases: {
              type: "array" as "array",
              title: "GitHub Trigger Aliases",
              items: {
                type: "object" as "object",
              },
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
                aliasArray.schema
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
            gitTags: {
              title: "Git Tag Version Definitions",
              ...overrideRadioBox(
                "gitTagAliases",
                ["Override Repo Git Tags", "Default to Repo Git Tags"],
                gitTagArray.schema
              ),
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
                ...insertIf(projectType === ProjectType.AttachedProject, {
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
                aliasArray.schema
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
            "ui:data-cy": "pr-testing-override-radio-box",
            ...overrideStyling,
          },
          githubPrAliases: {
            ...aliasRowUiSchema({
              addButtonText: "Add Patch Definition",
              numberedTitle: "Patch Definition",
            }),
          },
          repoData: {
            githubPrAliases: {
              ...aliasRowUiSchema({
                isRepo: true,
                numberedTitle: "Repo Patch Definition",
              }),
            },
          },
        },
        githubTriggerAliases: {
          "ui:addable": false,
          "ui:orderable": false,
          "ui:placeholder": "No GitHub Trigger Aliases are defined.",
          "ui:readonly": true,
          "ui:removable": false,
          "ui:descriptionNode": (
            <GithubTriggerAliasDescription identifier={identifier} />
          ),
          items: {
            "ui:field": "githubTriggerAliasField",
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
          githubCheckAliasesOverride: overrideStyling,
          githubCheckAliases: aliasRowUiSchema({
            addButtonText: "Add Definition",
            numberedTitle: "Commit Check Definition",
          }),
          repoData: {
            githubCheckAliases: aliasRowUiSchema({
              isRepo: true,
              numberedTitle: "Repo Commit Check Definition",
            }),
          },
        },
        gitTagVersionsTitle: {
          "ui:sectionTitle": true,
        },
        gitTagVersionsEnabled: {
          "ui:data-cy": "git-tag-enabled-radio-box",
          "ui:showLabel": false,
          "ui:widget": widgets.RadioBoxWidget,
        },
        users: userTeamStyling(
          "gitTagAuthorizedUsers",
          "Add User",
          repoData?.github?.users?.gitTagAuthorizedUsers === undefined,
          formData?.github?.gitTagVersionsEnabled,
          repoData?.github?.gitTagVersionsEnabled
        ),
        teams: userTeamStyling(
          "gitTagAuthorizedTeams",
          "Add Team",
          repoData?.github?.teams?.gitTagAuthorizedTeams === undefined,
          formData?.github?.gitTagVersionsEnabled,
          repoData?.github?.gitTagVersionsEnabled
        ),
        gitTags: {
          ...hideIf(
            formData?.github?.gitTagVersionsEnabled,
            repoData?.github?.gitTagVersionsEnabled
          ),
          gitTagAliasesOverride: overrideStyling,
          gitTagAliases: gitTagArray.uiSchema,
          repoData: {
            gitTagAliases: {
              ...gitTagArray.uiSchema,
              "ui:readonly": true,
              items: {
                ...gitTagArray.uiSchema.items,
                "ui:numberedTitle": "Repo Git Tag",
              },
            },
          },
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
          "ui:data-cy": "require-signed-radio-box",
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
            ...overrideStyling,
          },
          commitQueueAliases: {
            ...aliasRowUiSchema({
              addButtonText: "Add Patch Definition",
              numberedTitle: "Patch Definition",
            }),
          },
          repoData: {
            commitQueueAliases: {
              ...aliasRowUiSchema({
                numberedTitle: "Repo Patch Definition",
                isRepo: true,
              }),
            },
          },
        },
      },
    },
  };
};

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

const GithubTriggerAliasDescription = ({
  identifier,
}: {
  identifier: string;
}) => {
  const tab = ProjectSettingsTabRoutes.PatchAliases;
  return (
    <Description>
      GitHub Trigger Aliases can be configured on the{" "}
      <StyledRouterLink to={getProjectSettingsRoute(identifier, tab)}>
        {getTabTitle(tab).title}
      </StyledRouterLink>{" "}
      page.
    </Description>
  );
};
