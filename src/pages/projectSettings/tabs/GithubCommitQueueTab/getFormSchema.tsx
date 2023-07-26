import { Description } from "@leafygreen-ui/typography";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { StyledRouterLink, StyledLink } from "components/styles";
import {
  commitQueueAliasesDocumentationUrl,
  pullRequestAliasesDocumentationUrl,
  gitTagAliasesDocumentationUrl,
  githubChecksAliasesDocumentationUrl,
} from "constants/externalResources";
import {
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
} from "constants/routes";
import { GithubProjectConflicts, MergeQueue } from "gql/generated/types";
import { getTabTitle } from "pages/projectSettings/getTabTitle";
import { alias, form, ProjectType } from "../utils";
import { githubConflictErrorStyling, sectionHasError } from "./getErrors";
import { GithubTriggerAliasField } from "./GithubTriggerAliasField";
import { GCQFormState } from "./types";

const { aliasArray, aliasRowUiSchema, gitTagArray } = alias;
const { insertIf, overrideRadioBox, placeholderIf, radioBoxOptions } = form;

export const getFormSchema = (
  identifier: string,
  projectType: ProjectType,
  githubWebhooksEnabled: boolean,
  formData: GCQFormState,
  githubProjectConflicts: GithubProjectConflicts,
  versionControlEnabled: boolean,
  repoData?: GCQFormState
): ReturnType<GetFormSchema> => {
  const overrideStyling = {
    "ui:showLabel": false,
    "ui:widget":
      projectType === ProjectType.AttachedProject
        ? widgets.RadioBoxWidget
        : "hidden",
  };

  const errorStyling = sectionHasError(versionControlEnabled, projectType);

  return {
    fields: {
      githubTriggerAliasField: GithubTriggerAliasField,
    },
    schema: {
      properties: {
        commitQueue: {
          dependencies: {
            enabled: {
              oneOf: [
                {
                  properties: {
                    enabled: {
                      enum: [false],
                    },
                    message: {
                      title: "Commit Queue Message",
                      type: "string" as "string",
                    },
                  },
                },
                {
                  properties: {
                    enabled: {
                      enum: [true],
                    },
                    mergeMethod: {
                      oneOf: [
                        {
                          enum: ["squash"],
                          title: "Squash",
                          type: "string" as "string",
                        },
                        {
                          enum: ["merge"],
                          title: "Merge",
                          type: "string" as "string",
                        },
                        {
                          enum: ["rebase"],
                          title: "Rebase",
                          type: "string" as "string",
                        },
                        ...insertIf(
                          projectType === ProjectType.AttachedProject,
                          {
                            enum: [""],
                            title: `Default to Repo (${repoData?.commitQueue?.mergeMethod})`,
                            type: "string" as "string",
                          }
                        ),
                      ],
                      title: "Merge Method",
                      type: "string" as "string",
                    },
                    mergeQueue: {
                      oneOf: [
                        {
                          description:
                            "Use the standard commit queue owned and maintained by Evergreen.",
                          enum: [MergeQueue.Evergreen],
                          title: "Evergreen",
                          type: "string" as "string",
                        },
                        {
                          description: "Use the GitHub merge queue.",
                          enum: [MergeQueue.Github],
                          title: "GitHub",
                          type: "string" as "string",
                        },
                      ],
                      type: "string" as "string",
                    },
                    mergeQueueTitle: {
                      title: "Merge Queue",
                      type: "null",
                    },
                    message: {
                      title: "Commit Queue Message",
                      type: "string" as "string",
                    },
                    patchDefinitions: {
                      title: "Commit Queue Patch Definitions",
                      type: "object" as "object",
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
              ],
            },
          },
          properties: {
            enabled: {
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.commitQueue?.enabled
              ),
              type: ["boolean", "null"],
            },
          },
          title: "Commit Queue",
          type: "object" as "object",
        },
        github: {
          properties: {
            gitTagVersionsEnabled: {
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.github?.gitTagVersionsEnabled
              ),
              type: ["boolean", "null"],
            },
            gitTagVersionsTitle: {
              description:
                "If an authorized user pushes a tag that matches a regex, then a version can be created from this alias.",
              title: "Trigger Versions With Git Tags",
              type: "null",
            },
            gitTags: {
              title: "Git Tag Version Definitions",
              ...overrideRadioBox(
                "gitTagAliases",
                ["Override Repo Git Tags", "Default to Repo Git Tags"],
                gitTagArray.schema
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
            githubChecksEnabled: {
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.github?.githubChecksEnabled
              ),
              type: ["boolean", "null"],
            },
            githubChecksEnabledTitle: {
              title: "GitHub Commit Checks",
              type: "null",
            },
            githubTriggerAliases: {
              items: {
                type: "object" as "object",
              },
              title: "GitHub Trigger Aliases",
              type: "array" as "array",
            },
            githubWebhooksEnabled: {
              description: `GitHub webhooks ${
                githubWebhooksEnabled ? "are" : "are not"
              } enabled.`,
              title: "GitHub Webhooks",
              type: "null",
            },
            manualPrTestingEnabled: {
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.github?.manualPrTestingEnabled
              ),
              title: "Manual Testing",
              type: ["boolean", "null"],
            },
            prTesting: {
              title: "GitHub Patch Definitions",
              type: "object" as "object",
              ...overrideRadioBox(
                "githubPrAliases",
                [
                  "Override Repo Patch Definition",
                  "Default to Repo Patch Definition",
                ],
                aliasArray.schema
              ),
            },
            prTestingEnabled: {
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.github?.prTestingEnabled
              ),
              title: "Automated Testing",
              type: ["boolean", "null"],
            },
            prTestingEnabledTitle: {
              title: "GitHub Pull Request Testing",
              type: "null",
              ...(projectType === ProjectType.Repo && {
                description:
                  "If enabled, then untracked branches will also use the file patterns defined here for PR testing.",
              }),
            },
            teams: {
              description:
                "This should be the team slug, i.e. the team name with dashes instead of spaces. For example, the team Evergreen Users would be evergreen-users. MANA entitlements may also be used to manage this authorization.",
              title: "Authorized Teams",
              ...overrideRadioBox(
                "gitTagAuthorizedTeams",
                ["Override Repo Teams", "Default to Repo Teams"],
                {
                  items: {
                    default: "",
                    minLength: 1,
                    title: "Team",
                    type: "string" as "string",
                  },
                  type: "array" as "array",
                }
              ),
            },
            users: {
              description:
                "MANA entitlements may also be used to manage this authorization.",
              title: "Authorized Users",
              ...overrideRadioBox(
                "gitTagAuthorizedUsers",
                ["Override Repo Users", "Default to Repo Users"],
                {
                  items: {
                    default: "",
                    minLength: 1,
                    title: "Username",
                    type: "string" as "string",
                  },
                  type: "array" as "array",
                }
              ),
            },
          },
          title: "GitHub",
          type: "object" as "object",
        },
      },
      type: "object" as "object",
    },
    uiSchema: {
      commitQueue: {
        enabled: {
          "ui:data-cy": "cq-enabled-radio-box",
          "ui:showLabel": false,
          "ui:widget": widgets.RadioBoxWidget,
          ...githubConflictErrorStyling(
            githubProjectConflicts?.commitQueueIdentifiers,
            formData?.commitQueue?.enabled,
            repoData?.commitQueue?.enabled,
            "the Commit Queue"
          ),
        },
        mergeMethod: {
          "ui:allowDeselect": false,
          "ui:data-cy": "merge-method-select",
        },
        mergeQueue: {
          "ui:widget": "radio",
        },
        message: {
          "ui:data-cy": "cq-message-input",
          "ui:description": "Shown in commit queue CLI commands & web UI",
          ...placeholderIf(repoData?.commitQueue?.message),
        },
        patchDefinitions: {
          ...errorStyling(
            formData?.commitQueue?.enabled,
            formData?.commitQueue?.patchDefinitions?.commitQueueAliasesOverride,
            formData?.commitQueue?.patchDefinitions?.commitQueueAliases,
            repoData?.commitQueue?.patchDefinitions?.commitQueueAliases,
            "Commit Queue Patch Definition"
          ),
          commitQueueAliases: {
            ...aliasRowUiSchema({
              addButtonText: "Add Commit Queue Patch Definition",
              numberedTitle: "Patch Definition",
            }),
          },
          commitQueueAliasesOverride: {
            "ui:data-cy": "cq-override-radio-box",
            ...overrideStyling,
          },
          repoData: {
            commitQueueAliases: {
              ...aliasRowUiSchema({
                isRepo: true,
                numberedTitle: "Repo Patch Definition",
              }),
            },
          },
          "ui:description": CommitQueueAliasesDescription,
        },
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:data-cy": "cq-card",
      },
      github: {
        gitTagVersionsEnabled: {
          "ui:data-cy": "git-tag-enabled-radio-box",
          "ui:showLabel": false,
          "ui:widget": widgets.RadioBoxWidget,
        },
        gitTagVersionsTitle: {
          "ui:sectionTitle": true,
        },
        gitTags: {
          ...hideIf(
            fieldDisabled(
              formData?.github?.gitTagVersionsEnabled,
              repoData?.github?.gitTagVersionsEnabled
            )
          ),
          ...errorStyling(
            formData?.github?.gitTagVersionsEnabled,
            formData?.github?.gitTags?.gitTagAliasesOverride,
            formData?.github?.gitTags?.gitTagAliases,
            repoData?.github?.gitTags?.gitTagAliases,
            "Git Tag Version Definition"
          ),
          gitTagAliases: gitTagArray.uiSchema,
          gitTagAliasesOverride: overrideStyling,
          repoData: {
            gitTagAliases: {
              ...gitTagArray.uiSchema,
              items: {
                ...gitTagArray.uiSchema.items,
                "ui:numberedTitle": "Repo Git Tag",
              },
              "ui:readonly": true,
            },
          },
          "ui:description": GitTagAliasesDescription,
        },
        githubChecks: {
          ...hideIf(
            fieldDisabled(
              formData?.github?.githubChecksEnabled,
              repoData?.github?.githubChecksEnabled
            )
          ),
          ...errorStyling(
            formData?.github?.githubChecksEnabled,
            formData?.github?.githubChecks?.githubCheckAliasesOverride,
            formData?.github?.githubChecks?.githubCheckAliases,
            repoData?.github?.githubChecks?.githubCheckAliases,
            "Commit Check Definition"
          ),
          githubCheckAliases: aliasRowUiSchema({
            addButtonText: "Add Definition",
            numberedTitle: "Commit Check Definition",
          }),
          githubCheckAliasesOverride: overrideStyling,
          repoData: {
            githubCheckAliases: aliasRowUiSchema({
              isRepo: true,
              numberedTitle: "Repo Commit Check Definition",
            }),
          },
        },
        githubChecksEnabled: {
          "ui:data-cy": "github-checks-enabled-radio-box",
          "ui:showLabel": false,
          "ui:widget": widgets.RadioBoxWidget,

          ...githubConflictErrorStyling(
            githubProjectConflicts?.commitCheckIdentifiers,
            formData?.github?.githubChecksEnabled,
            repoData?.github?.githubChecksEnabled,
            "Commit Checks"
          ),
        },
        githubChecksEnabledTitle: {
          "ui:description": GitHubChecksAliasesDescription,
          "ui:sectionTitle": true,
        },
        githubTriggerAliases: {
          items: {
            "ui:field": "githubTriggerAliasField",
          },
          "ui:addable": false,
          "ui:descriptionNode": (
            <GithubTriggerAliasDescription identifier={identifier} />
          ),
          "ui:orderable": false,
          "ui:placeholder": "No GitHub Trigger Aliases are defined.",
          "ui:readonly": true,
          "ui:removable": false,
        },
        manualPrTestingEnabled: {
          "ui:data-cy": "manual-pr-testing-enabled-radio-box",
          "ui:description":
            "Patches can be run manually by commenting ‘evergreen patch’ on the PR even if automated testing isn't enabled.",
          "ui:widget": widgets.RadioBoxWidget,
          ...githubConflictErrorStyling(
            githubProjectConflicts?.prTestingIdentifiers,
            formData?.github?.manualPrTestingEnabled,
            repoData?.github?.manualPrTestingEnabled,
            "PR Testing"
          ),
        },
        prTesting: {
          ...hideIf(
            fieldDisabled(
              formData?.github?.prTestingEnabled,
              repoData?.github?.prTestingEnabled
            ) &&
              fieldDisabled(
                formData?.github?.manualPrTestingEnabled,
                repoData?.github?.manualPrTestingEnabled
              )
          ),
          ...errorStyling(
            formData?.github?.prTestingEnabled,
            formData?.github?.prTesting?.githubPrAliasesOverride,
            formData?.github?.prTesting?.githubPrAliases,
            repoData?.github?.prTesting?.githubPrAliases,
            "GitHub Patch Definition"
          ),
          githubPrAliases: {
            ...aliasRowUiSchema({
              addButtonText: "Add Patch Definition",
              numberedTitle: "Patch Definition",
            }),
          },
          githubPrAliasesOverride: {
            "ui:data-cy": "pr-testing-override-radio-box",
            ...overrideStyling,
          },
          repoData: {
            githubPrAliases: {
              ...aliasRowUiSchema({
                isRepo: true,
                numberedTitle: "Repo Patch Definition",
              }),
            },
          },
          "ui:description": PRAliasesDescription,
        },
        prTestingEnabled: {
          "ui:data-cy": "pr-testing-enabled-radio-box",
          "ui:widget": widgets.RadioBoxWidget,

          ...githubConflictErrorStyling(
            githubProjectConflicts?.prTestingIdentifiers,
            formData?.github?.prTestingEnabled,
            repoData?.github?.prTestingEnabled,
            "PR Testing"
          ),
        },
        prTestingEnabledTitle: {
          "ui:sectionTitle": true,
        },
        teams: userTeamStyling(
          "gitTagAuthorizedTeams",
          "Add Team",
          repoData?.github?.teams?.gitTagAuthorizedTeams === undefined,
          formData?.github?.gitTagVersionsEnabled,
          repoData?.github?.gitTagVersionsEnabled
        ),
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        users: userTeamStyling(
          "gitTagAuthorizedUsers",
          "Add User",
          repoData?.github?.users?.gitTagAuthorizedUsers === undefined,
          formData?.github?.gitTagVersionsEnabled,
          repoData?.github?.gitTagVersionsEnabled
        ),
      },
    },
  };
};

const fieldDisabled = (field: boolean | null, repoField: boolean | null) =>
  field === false || (field === null && repoField === false);

const hideIf = (shouldHide: boolean) =>
  shouldHide && {
    "ui:widget": "hidden",
  };

const overrideStyling = (isMissingRepoField: boolean) => ({
  "ui:showLabel": false,
  "ui:widget": isMissingRepoField ? "hidden" : widgets.RadioBoxWidget,
});

const userTeamStyling = (
  fieldName: string,
  addButtonText: string,
  shouldOverride: boolean,
  field: boolean | null,
  repoField: boolean | null
) => ({
  ...hideIf(fieldDisabled(field, repoField)),
  [`${fieldName}Override`]: {
    ...overrideStyling(shouldOverride),
  },
  [fieldName]: {
    "ui:addButtonText": addButtonText,
    "ui:orderable": false,
    "ui:showLabel": false,
  },
  repoData: {
    [fieldName]: {
      "ui:disabled": true,
      "ui:orderable": false,
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

const PRAliasesDescription = (
  <>
    For patches created from GitHub pull requests, Evergreen will schedule only
    the tasks and variants matching the tags/regex definitions. All regular
    expressions must be valid Golang regular expressions. These aliases{" "}
    <StyledLink href={pullRequestAliasesDocumentationUrl}>
      may be defined
    </StyledLink>{" "}
    in this project&rsquo;s config YAML instead if Version Control is enabled
    and no aliases are defined on the project or repo page.
  </>
);

const CommitQueueAliasesDescription = (
  <>
    Changes on the Commit Queue are tested with all variants and tasks that
    match each variant and task regex pair. These aliases{" "}
    <StyledLink href={commitQueueAliasesDocumentationUrl}>
      may be defined
    </StyledLink>{" "}
    in this project&rsquo;s config YAML instead if Version Control is enabled
    and no aliases are defined on the project or repo page.
  </>
);

const GitTagAliasesDescription = (
  <>
    Either the version will be fully populated from a new file, OR variants and
    tasks can be defined for the default config file using variant and task
    regexes/tags. If multiple regexes match and a config file has been defined
    for one or more of them, the version is ambiguous and no version will be
    created. These aliases{" "}
    <StyledLink href={gitTagAliasesDocumentationUrl}>may be defined</StyledLink>{" "}
    in this project&rsquo;s config YAML instead if Version Control is enabled
    and no aliases are defined on the project or repo page.
  </>
);

const GitHubChecksAliasesDescription = (
  <>
    Commits will send their status as a Github Check (the check will pass/fail
    based only on the tasks matching the tags/regexes definitions). These
    aliases{" "}
    <StyledLink href={githubChecksAliasesDocumentationUrl}>
      may be defined
    </StyledLink>{" "}
    in this project&rsquo;s config YAML instead if Version Control is enabled
    and no aliases are defined on the project or repo page.
  </>
);
