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
  githubMergeQueueDocumentationUrl,
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
  repoData?: GCQFormState,
): ReturnType<GetFormSchema> => {
  const overrideStyling = {
    "ui:widget":
      projectType === ProjectType.AttachedProject
        ? widgets.RadioBoxWidget
        : "hidden",
    "ui:showLabel": false,
  };

  const errorStyling = sectionHasError(versionControlEnabled, projectType);

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
              title: "Automated Testing",
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.github?.prTestingEnabled,
              ),
            },
            manualPrTestingEnabled: {
              type: ["boolean", "null"],
              title: "Manual Testing",
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.github?.manualPrTestingEnabled,
              ),
            },
            prTesting: {
              type: "object" as "object",
              title: "GitHub Patch Definitions",
              ...overrideRadioBox(
                "githubPrAliases",
                [
                  "Override Repo Patch Definition",
                  "Default to Repo Patch Definition",
                ],
                aliasArray.schema,
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
            },
            githubChecksEnabled: {
              type: ["boolean", "null"],
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.github?.githubChecksEnabled,
              ),
            },
            githubChecks: {
              title: "Commit Check Definitions",
              ...overrideRadioBox(
                "githubCheckAliases",
                ["Override Repo Definition", "Default to Repo Definition"],
                aliasArray.schema,
              ),
            },
            gitTagVersionsTitle: {
              type: "null",
              title: "Trigger Versions With Git Tags",
              description:
                "If an authorized user pushes a tag that matches a specific regex, then a version will be created from this alias. Note that project admins are not authorized by default; they must explicitly be given this permission.",
            },
            gitTagVersionsEnabled: {
              type: ["boolean", "null"],
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.github?.gitTagVersionsEnabled,
              ),
            },
            users: {
              title: "Authorized Users",
              description:
                "This must be a list of authorized GitHub user or bot names. This authorization can alternatively be provisioned on this project's MANA resource.",
              ...overrideRadioBox(
                "gitTagAuthorizedUsers",
                ["Override Repo Users", "Default to Repo Users"],
                {
                  type: "array" as "array",
                  items: {
                    type: "string" as "string",
                    title: "Username",
                    default: "",
                    minLength: 1,
                    format: "noStartingOrTrailingWhitespace",
                  },
                },
              ),
            },
            teams: {
              title: "Authorized Teams",
              description:
                "This must be the team slug, i.e. the team name with dashes instead of spaces. For example, the team Evergreen Users would be evergreen-users. This authorization can also be provisioned on this project's MANA resource.",
              ...overrideRadioBox(
                "gitTagAuthorizedTeams",
                ["Override Repo Teams", "Default to Repo Teams"],
                {
                  type: "array" as "array",
                  items: {
                    type: "string" as "string",
                    title: "Team",
                    default: "",
                    minLength: 1,
                    format: "noStartingOrTrailingWhitespace",
                  },
                },
              ),
            },
            gitTags: {
              title: "Git Tag Version Definitions",
              ...overrideRadioBox(
                "gitTagAliases",
                ["Override Repo Git Tags", "Default to Repo Git Tags"],
                gitTagArray.schema,
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
                repoData?.commitQueue?.enabled,
              ),
            },
          },
          dependencies: {
            enabled: {
              oneOf: [
                {
                  properties: {
                    enabled: {
                      enum: [false],
                    },
                    message: {
                      type: "string" as "string",
                      title: "Commit Queue Message",
                    },
                  },
                },
                {
                  properties: {
                    enabled: {
                      enum: [true],
                    },
                    message: {
                      type: "string" as "string",
                      title: "Commit Queue Message",
                    },
                    mergeSettings: {
                      title: "Merge Queue",
                      type: "object" as "object",
                      properties: {
                        mergeQueue: {
                          type: "string" as "string",
                          oneOf: [
                            {
                              type: "string" as "string",
                              title: "GitHub",
                              enum: [MergeQueue.Github],
                              description: "GitHub's merge queue.",
                            },
                            {
                              type: "string" as "string",
                              title: "Evergreen (deprecated)",
                              enum: [MergeQueue.Evergreen],
                              description: "Evergreen's commit queue.",
                            },
                          ],
                        },
                      },
                      dependencies: {
                        mergeQueue: {
                          oneOf: [
                            {
                              properties: {
                                mergeQueue: {
                                  enum: [MergeQueue.Evergreen],
                                },
                                mergeMethod: {
                                  type: "string" as "string",
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
                                    ...insertIf(
                                      projectType ===
                                        ProjectType.AttachedProject,
                                      {
                                        type: "string" as "string",
                                        title: `Default to Repo (${repoData?.commitQueue?.mergeSettings?.mergeMethod})`,
                                        enum: [""],
                                      },
                                    ),
                                  ],
                                },
                              },
                            },
                            {
                              properties: {
                                mergeQueue: {
                                  enum: [MergeQueue.Github],
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                    patchDefinitions: {
                      type: "object" as "object",
                      title: "Commit Queue Patch Definitions",
                      ...overrideRadioBox(
                        "commitQueueAliases",
                        [
                          "Override Repo Patch Definition",
                          "Default to Repo Patch Definition",
                        ],
                        aliasArray.schema,
                      ),
                    },
                  },
                },
              ],
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
          "ui:data-cy": "pr-testing-enabled-radio-box",
          "ui:widget": widgets.RadioBoxWidget,

          ...githubConflictErrorStyling(
            githubProjectConflicts?.prTestingIdentifiers,
            formData?.github?.prTestingEnabled,
            repoData?.github?.prTestingEnabled,
            "PR Testing",
          ),
        },
        manualPrTestingEnabled: {
          "ui:data-cy": "manual-pr-testing-enabled-radio-box",
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "Patches can be run manually by commenting ‘evergreen patch’ on the PR even if automated testing isn't enabled.",
          ...githubConflictErrorStyling(
            githubProjectConflicts?.prTestingIdentifiers,
            formData?.github?.manualPrTestingEnabled,
            repoData?.github?.manualPrTestingEnabled,
            "PR Testing",
          ),
        },
        prTesting: {
          ...hideIf(
            fieldDisabled(
              formData?.github?.prTestingEnabled,
              repoData?.github?.prTestingEnabled,
            ) &&
              fieldDisabled(
                formData?.github?.manualPrTestingEnabled,
                repoData?.github?.manualPrTestingEnabled,
              ),
          ),
          ...errorStyling(
            formData?.github?.prTestingEnabled,
            formData?.github?.prTesting?.githubPrAliasesOverride,
            formData?.github?.prTesting?.githubPrAliases,
            repoData?.github?.prTesting?.githubPrAliases,
            "GitHub Patch Definition",
          ),
          githubPrAliasesOverride: {
            "ui:data-cy": "pr-testing-override-radio-box",
            ...overrideStyling,
          },
          "ui:description": PRAliasesDescription,
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
            "ui:label": false,
          },
        },
        githubChecksEnabledTitle: {
          "ui:sectionTitle": true,
          "ui:description": GitHubChecksAliasesDescription,
        },
        githubChecksEnabled: {
          "ui:data-cy": "github-checks-enabled-radio-box",
          "ui:showLabel": false,
          "ui:widget": widgets.RadioBoxWidget,

          ...githubConflictErrorStyling(
            githubProjectConflicts?.commitCheckIdentifiers,
            formData?.github?.githubChecksEnabled,
            repoData?.github?.githubChecksEnabled,
            "Commit Checks",
          ),
        },
        githubChecks: {
          ...hideIf(
            fieldDisabled(
              formData?.github?.githubChecksEnabled,
              repoData?.github?.githubChecksEnabled,
            ),
          ),
          ...errorStyling(
            formData?.github?.githubChecksEnabled,
            formData?.github?.githubChecks?.githubCheckAliasesOverride,
            formData?.github?.githubChecks?.githubCheckAliases,
            repoData?.github?.githubChecks?.githubCheckAliases,
            "Commit Check Definition",
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
          repoData?.github?.gitTagVersionsEnabled,
        ),
        teams: userTeamStyling(
          "gitTagAuthorizedTeams",
          "Add Team",
          repoData?.github?.teams?.gitTagAuthorizedTeams === undefined,
          formData?.github?.gitTagVersionsEnabled,
          repoData?.github?.gitTagVersionsEnabled,
        ),
        gitTags: {
          ...hideIf(
            fieldDisabled(
              formData?.github?.gitTagVersionsEnabled,
              repoData?.github?.gitTagVersionsEnabled,
            ),
          ),
          ...errorStyling(
            formData?.github?.gitTagVersionsEnabled,
            formData?.github?.gitTags?.gitTagAliasesOverride,
            formData?.github?.gitTags?.gitTagAliases,
            repoData?.github?.gitTags?.gitTagAliases,
            "Git Tag Version Definition",
          ),
          gitTagAliasesOverride: overrideStyling,
          "ui:description": GitTagAliasesDescription,
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
          ...githubConflictErrorStyling(
            githubProjectConflicts?.commitQueueIdentifiers,
            formData?.commitQueue?.enabled,
            repoData?.commitQueue?.enabled,
            "the Commit Queue",
          ),
        },
        message: {
          "ui:description": "Shown in commit queue CLI commands & web UI",
          "ui:data-cy": "cq-message-input",
          ...placeholderIf(repoData?.commitQueue?.message),
        },
        mergeSettings: {
          "ui:description": GitHubMergeQueueDescription,
          mergeQueue: {
            "ui:widget": "radio",
          },
          mergeMethod: {
            "ui:allowDeselect": false,
            "ui:data-cy": "merge-method-select",
          },
        },
        patchDefinitions: {
          ...errorStyling(
            formData?.commitQueue?.enabled,
            formData?.commitQueue?.patchDefinitions?.commitQueueAliasesOverride,
            formData?.commitQueue?.patchDefinitions?.commitQueueAliases,
            repoData?.commitQueue?.patchDefinitions?.commitQueueAliases,
            "Commit Queue Patch Definition",
          ),
          commitQueueAliasesOverride: {
            "ui:data-cy": "cq-override-radio-box",
            ...overrideStyling,
          },
          "ui:description": CommitQueueAliasesDescription,
          commitQueueAliases: {
            ...aliasRowUiSchema({
              addButtonText: "Add Commit Queue Patch Definition",
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

const fieldDisabled = (field: boolean | null, repoField: boolean | null) =>
  field === false || (field === null && repoField === false);

const hideIf = (shouldHide: boolean) =>
  shouldHide && {
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
  repoField: boolean | null,
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

const GitHubMergeQueueDescription = (
  <>
    Choose to merge with Evergreen or GitHub. Note that in order to use the
    GitHub merge queue, you will need to complete the additional steps outlined
    in the <StyledLink href={githubMergeQueueDocumentationUrl}>docs</StyledLink>
    .
  </>
);
