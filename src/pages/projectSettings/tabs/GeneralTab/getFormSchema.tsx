import { Field } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { StyledLink } from "components/styles";
import { versionControlDocumentationUrl } from "constants/externalResources";
import { Project } from "gql/generated/types";
import { form, ProjectType } from "../utils";
import { RepoConfigField, RepotrackerField } from "./Fields";
import { FormState } from "./types";

const { insertIf, overrideRadioBox, placeholderIf, radioBoxOptions } = form;

export const getFormSchema = (
  projectId: string,
  projectType: ProjectType,
  validDefaultLoggers: Project["validDefaultLoggers"],
  identifierHasChanges: boolean,
  initialOwner: string,
  initialRepo: string,
  repoData?: FormState
): {
  fields: Record<string, Field>;
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  fields: {
    repoConfigField: RepoConfigField,
    repotrackerField: RepotrackerField,
  },
  schema: {
    type: "object" as "object",
    properties: {
      generalConfiguration: {
        type: "object" as "object",
        title: "General Configuration",
        properties: {
          enabled: {
            type: ["boolean", "null"],
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.generalConfiguration?.enabled
            ),
          },
          repositoryInfo: {
            type: "object" as "object",
            title: "Repository Info",
            properties: {
              owner: {
                type: "string" as "string",
                title: "Owner",
              },
              repo: {
                type: "string" as "string",
                title: "Repository",
              },
            },
          },
          branch: {
            type: "string" as "string",
            title: "Branch Name",
          },
          other: {
            type: "object" as "object",
            title: "Other",
            properties: {
              displayName: {
                type: "string" as "string",
                title: "Display Name",
              },
              ...(projectType !== ProjectType.Repo && {
                identifier: {
                  type: "string" as "string",
                  title: "Identifier",
                  default: "",
                  minLength: 1,
                },
              }),
              batchTime: {
                type: ["number", "null"],
                title: "Batch Time",
                minimum: 1,
              },
              remotePath: {
                type: "string" as "string",
                title: "Config File",
              },
              spawnHostScriptPath: {
                type: "string" as "string",
                title: "Spawn Host Script Path",
              },
              versionControlEnabled: {
                type: ["boolean", "null"],
                title: "Version Control",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.generalConfiguration?.other?.versionControlEnabled
                ),
              },
            },
          },
        },
      },
      projectFlags: {
        type: "object" as "object",
        title: "Project Flags",
        properties: {
          dispatchingDisabled: {
            type: ["boolean", "null"],
            title: "Dispatching",
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.projectFlags?.dispatchingDisabled,
              true
            ),
          },
          scheduling: {
            type: "object" as "object",
            title: "Scheduling Settings",
            properties: {
              deactivatePrevious: {
                type: ["boolean", "null"],
                title: "Old Task on Success",
                oneOf: radioBoxOptions(
                  ["Unschedule", "Don't Unschedule"],
                  repoData?.projectFlags?.scheduling?.deactivatePrevious
                ),
              },
            },
          },
          repotracker: {
            type: "object" as "object",
            title: "Repotracker Settings",
            properties: {
              repotrackerDisabled: {
                type: ["boolean", "null"],
                title: "Repotracker",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.projectFlags?.repotracker?.repotrackerDisabled,
                  true
                ),
              },
            },
          },
          logger: {
            type: "object" as "object",
            title: "Default Logger",
            properties: {
              defaultLogger: {
                type: "string" as "string",
                oneOf: [
                  ...insertIf(projectType === ProjectType.AttachedProject, {
                    type: "string" as "string",
                    title: `Default to Repo (${repoData?.projectFlags?.logger?.defaultLogger})`,
                    enum: [""],
                  }),
                  ...validDefaultLoggers.map((logger) => ({
                    type: "string" as "string",
                    title: logger,
                    enum: [logger],
                  })),
                ],
              },
            },
          },
          testResults: {
            type: "object" as "object",
            title: "Test Results",
            properties: {
              cedarTestResultsEnabled: {
                type: ["boolean", "null"],
                title: "Cedar Test Results",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.projectFlags?.testResults?.cedarTestResultsEnabled
                ),
              },
            },
          },
          patch: {
            type: "object" as "object",
            title: "Patch Settings",
            properties: {
              patchingDisabled: {
                type: ["boolean", "null"],
                title: "Patching",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.projectFlags?.patch?.patchingDisabled,
                  true
                ),
              },
            },
          },
          taskSync: {
            type: "object" as "object",
            title: "Task Sync",
            properties: {
              configEnabled: {
                type: ["boolean", "null"],
                title: "Project Config Commands",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.projectFlags?.taskSync.configEnabled
                ),
              },
              patchEnabled: {
                type: ["boolean", "null"],
                title: "Task in Patches",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.projectFlags?.taskSync.patchEnabled
                ),
              },
            },
          },
        },
      },
      historicalDataCaching: {
        type: "object" as "object",
        title: "Historical Data Caching Info",
        properties: {
          disabledStatsCache: {
            type: ["boolean", "null"],
            title: "Caching",
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.historicalDataCaching?.disabledStatsCache,
              true
            ),
          },
          files: {
            type: "object" as "object",
            title: "File Patterns to Ignore",
            description:
              "Comma-separated list of regular expression patterns that specify test filenames to ignore when caching test and task history.",
            ...overrideRadioBox(
              "filesIgnoredFromCache",
              ["Override Repo File Pattern", "Default to Repo File Pattern"],
              {
                type: "array" as "array",
                items: {
                  type: "string" as "string",
                  title: "File Pattern",
                  default: "",
                  minLength: 1,
                },
              }
            ),
          },
        },
      },
    },
  },
  uiSchema: {
    generalConfiguration: {
      "ui:rootFieldId": "generalConfiguration",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      enabled: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:showLabel": false,
        "ui:data-cy": "enabled-radio-box",
      },
      repositoryInfo: {
        "ui:field": "repoConfigField",
        "ui:disabled": projectType !== ProjectType.Project,
        options: {
          initialOwner,
          initialRepo,
          projectId,
          projectType,
          repoName: repoData?.generalConfiguration?.repositoryInfo?.repo,
          repoOwner: repoData?.generalConfiguration?.repositoryInfo?.owner,
        },
        owner: {
          ...placeholderIf(
            repoData?.generalConfiguration?.repositoryInfo?.owner
          ),
        },
        repo: {
          "ui:data-cy": "repo-input",
          ...placeholderIf(
            repoData?.generalConfiguration?.repositoryInfo?.repo
          ),
        },
      },
      branch: {
        ...placeholderIf(repoData?.generalConfiguration?.branch),
      },
      other: {
        displayName: {
          "ui:data-cy": "display-name-input",
        },
        identifier: {
          "ui:data-cy": "identifier-input",
          ...(identifierHasChanges && {
            "ui:warnings": [
              "Updates made to the project identifier will change the identifier used for the CLI, inter-project dependencies, etc. Project users should be made aware of this change, as the old identifier will no longer work.",
            ],
          }),
        },
        batchTime: {
          "ui:description":
            "The interval of time (in minutes) that Evergreen should wait in between activating the latest version.",
          ...placeholderIf(repoData?.generalConfiguration?.other?.batchTime),
        },
        remotePath: {
          ...placeholderIf(repoData?.generalConfiguration?.other?.remotePath),
        },
        spawnHostScriptPath: {
          "ui:description":
            "This is the bash setup script to optionally run on spawn hosts created from tasks.",
          "ui:data-cy": "spawn-host-input",
          ...placeholderIf(
            repoData?.generalConfiguration?.other?.spawnHostScriptPath
          ),
        },
        versionControlEnabled: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description": VersionControlEnabledDescription,
        },
      },
    },
    projectFlags: {
      "ui:rootFieldId": "projectFlags",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      dispatchingDisabled: {
        "ui:widget": widgets.RadioBoxWidget,
      },
      scheduling: {
        deactivatePrevious: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "When unscheduled, tasks from previous revisions will be unscheduled when the equivalent task in a newer commit finishes successfully.",
        },
      },
      repotracker: {
        "ui:field": "repotrackerField",
        options: { projectId },
        repotrackerDisabled: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "Repotracker will be triggered from GitHub push events sent via webhook.",
        },
      },
      logger: {
        defaultLogger: {
          "ui:allowDeselect": false,
          "ui:ariaLabelledBy": "projectFlags_logger__title",
          "ui:data-cy": "default-logger-select",
        },
      },
      testResults: {
        cedarTestResultsEnabled: {
          "ui:widget": widgets.RadioBoxWidget,
        },
      },
      patch: {
        patchingDisabled: {
          "ui:widget": widgets.RadioBoxWidget,
        },
      },
      taskSync: {
        configEnabled: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "Enable commands (e.g. s3.push, s3.pull) to sync the task directory in S3 from the config file.",
        },
        patchEnabled: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "Users can create patches that sync the task directory to S3 at the end of any task.",
        },
      },
    },
    historicalDataCaching: {
      "ui:rootFieldId": "historicalDataCaching",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      disabledStatsCache: {
        "ui:widget": widgets.RadioBoxWidget,
      },
      files: {
        filesIgnoredFromCacheOverride: {
          "ui:widget":
            projectType === ProjectType.AttachedProject
              ? widgets.RadioBoxWidget
              : "hidden",
          "ui:showLabel": false,
        },
        filesIgnoredFromCache: {
          "ui:addButtonText": "Add File Pattern",
          "ui:orderable": false,
          "ui:showLabel": false,
        },
        repoData: {
          filesIgnoredFromCache: {
            "ui:disabled": true,
            "ui:readonly": true,
            "ui:showLabel": false,
          },
        },
      },
    },
  },
});

const VersionControlEnabledDescription = (
  <>
    Enabling Version Control allows{" "}
    <StyledLink href={versionControlDocumentationUrl}>
      select properties
    </StyledLink>{" "}
    to be defined in this project&rsquo;s config YAML in addition to the UI.
  </>
);
