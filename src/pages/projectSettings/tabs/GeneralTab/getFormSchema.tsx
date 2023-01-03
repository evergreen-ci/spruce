import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { StyledLink } from "components/styles";
import { versionControlDocumentationUrl } from "constants/externalResources";
import { GetFormSchema } from "../types";
import { form, ProjectType } from "../utils";
import {
  DeactivateStepbackTaskField,
  RepoConfigField,
  RepotrackerField,
} from "./Fields";
import { FormState } from "./types";

const { placeholderIf, radioBoxOptions } = form;

export const getFormSchema = (
  projectId: string,
  projectType: ProjectType,
  identifierHasChanges: boolean,
  initialOwner: string,
  initialRepo: string,
  repoData?: FormState
): ReturnType<GetFormSchema> => ({
  fields: {
    deactivateStepbackTask: DeactivateStepbackTaskField,
    repoConfigField: RepoConfigField,
    repotrackerField: RepotrackerField,
  },
  schema: {
    type: "object" as "object",
    properties: {
      generalConfiguration: {
        type: "object" as "object",
        title: "General Configuration",
        required: ["branch"],
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
            required: ["owner", "repo"],
            properties: {
              owner: {
                type: "string" as "string",
                title: "Owner",
                format: "noSpaces",
                minLength: getMinLength(projectType, repoData, "owner"),
                default: "",
              },
              repo: {
                type: "string" as "string",
                title: "Repository",
                format: "noSpaces",
                minLength: getMinLength(projectType, repoData, "repo"),
                default: "",
              },
            },
          },
          branch: {
            type: "string" as "string",
            title: "Branch Name",
            minLength: getMinLength(projectType, repoData, "branch"),
            default: "",
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
              forceRun: {
                type: "null" as "null",
              },
            },
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
              stepbackDisabled: {
                type: ["boolean", "null"],
                title: "Stepback",
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.projectFlags?.scheduling?.stepbackDisabled,
                  true
                ),
              },
              deactivateStepback: {
                type: "null" as "null",
              },
            },
          },
          patch: {
            type: "object" as "object",
            title: "Patch Settings",
            description:
              "Sets if users are allowed to create patches for this branch.",
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
      historicalTaskDataCaching: {
        type: "object" as "object",
        title: "Historical Task Data Caching Info",
        properties: {
          disabledStatsCache: {
            type: ["boolean", "null"],
            title: "Cache Daily Task Statistics",
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.historicalTaskDataCaching?.disabledStatsCache,
              true
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
          "ui:data-cy": "batch-time-input",
          ...placeholderIf(repoData?.generalConfiguration?.other?.batchTime),
        },
        remotePath: {
          "ui:description":
            "Path to yaml file where project tasks, variants, and other settings are defined.",
          ...placeholderIf(repoData?.generalConfiguration?.other?.remotePath),
        },
        spawnHostScriptPath: {
          "ui:description":
            "This is the bash setup script to optionally run on spawn hosts created from tasks.",
          "ui:data-cy": "spawn-host-input",
          "ui:optional": true,
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
        "ui:description": "Sets if any tasks can be dispatched.",
      },
      repotracker: {
        repotrackerDisabled: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description": `The repotracker will be triggered from GitHub push events sent via webhook. 
            This creates mainline builds for merged commits.`,
        },
        forceRun: {
          "ui:field": "repotrackerField",
          "ui:showLabel": false,
          options: { projectId },
        },
      },
      scheduling: {
        deactivatePrevious: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "When unscheduled, tasks from previous revisions will be unscheduled when the equivalent task in a newer commit finishes successfully.",
        },
        stepbackDisabled: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "Disabling this setting will override all enabled stepback settings for the project. Disabling stepback won't cancel any active stepback tasks, but it will prevent any future ones.",
        },
        deactivateStepback: {
          "ui:field": "deactivateStepbackTask",
          "ui:showLabel": false,
          options: { projectId },
        },
      },
      patch: {
        patchingDisabled: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:showLabel": false,
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
    historicalTaskDataCaching: {
      "ui:rootFieldId": "historicalTaskDataCaching",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      disabledStatsCache: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:description":
          "Task execution statistics aggregated by project, build variant, distro, task name, and task creation date.",
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

const getMinLength = (
  projectType: ProjectType,
  repoData: FormState,
  value: string
): number => {
  const repoGeneral = repoData?.generalConfiguration;
  const repository = repoGeneral?.repositoryInfo;

  if (projectType === ProjectType.AttachedProject) {
    // if the project defaults to the repo, allow the value to be defined there instead
    switch (value) {
      case "owner":
        return repository?.owner ? 0 : 1;
      case "repo":
        return repository?.repo ? 0 : 1;
      case "branch":
        return repoGeneral?.branch ? 0 : 1;
      default:
        return 1;
    }
  }
  return 1;
};
