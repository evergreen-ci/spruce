import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { StyledLink } from "components/styles";
import { versionControlDocumentationUrl } from "constants/externalResources";
import { form, ProjectType } from "../utils";
import {
  DeactivateStepbackTaskField,
  DeleteProjectField,
  RepoConfigField,
  RepotrackerField,
} from "./Fields";
import { GeneralFormState } from "./types";

const { placeholderIf, radioBoxOptions } = form;

export const getFormSchema = (
  projectId: string,
  projectType: ProjectType,
  identifierHasChanges: boolean,
  initialOwner: string,
  initialRepo: string,
  repoData?: GeneralFormState
): ReturnType<GetFormSchema> => ({
  fields: {
    deactivateStepbackTask: DeactivateStepbackTaskField,
    deleteProjectField: DeleteProjectField,
    repoConfigField: RepoConfigField,
    repotrackerField: RepotrackerField,
  },
  schema: {
    properties: {
      generalConfiguration: {
        properties: {
          ...(projectType !== ProjectType.Repo && {
            enabled: {
              oneOf: radioBoxOptions(["Enabled", "Disabled"]),
              type: "boolean" as "boolean",
            },
          }),
          repositoryInfo: {
            properties: {
              owner: {
                default: "",
                format: "noSpaces",
                minLength: getMinLength(projectType, repoData, "owner"),
                title: "Owner",
                type: "string" as "string",
              },
              repo: {
                default: "",
                format: "noSpaces",
                minLength: getMinLength(projectType, repoData, "repo"),
                title: "Repository",
                type: "string" as "string",
              },
            },
            required: ["owner", "repo"],
            title: "Repository Info",
            type: "object" as "object",
          },
          ...(projectType !== ProjectType.Repo && {
            branch: {
              title: "Branch Name",
              type: "string" as "string",
            },
          }),
          other: {
            properties: {
              displayName: {
                title: "Display Name",
                type: "string" as "string",
              },
              ...(projectType !== ProjectType.Repo && {
                identifier: {
                  default: "",
                  minLength: 1,
                  title: "Identifier",
                  type: "string" as "string",
                },
              }),
              batchTime: {
                minimum: 1,
                title: "Batch Time",
                type: ["number", "null"],
              },
              remotePath: {
                title: "Config File",
                type: "string" as "string",
              },
              spawnHostScriptPath: {
                title: "Spawn Host Script Path",
                type: "string" as "string",
              },
              versionControlEnabled: {
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.generalConfiguration?.other?.versionControlEnabled
                ),
                title: "Version Control",
                type: ["boolean", "null"],
              },
            },
            title: "Other",
            type: "object" as "object",
          },
        },
        title: "General Configuration",
        type: "object" as "object",
      },
      historicalTaskDataCaching: {
        properties: {
          disabledStatsCache: {
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.historicalTaskDataCaching?.disabledStatsCache,
              true
            ),
            title: "Cache Daily Task Statistics",
            type: ["boolean", "null"],
          },
        },
        title: "Historical Task Data Caching Info",
        type: "object" as "object",
      },
      projectFlags: {
        properties: {
          dispatchingDisabled: {
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              repoData?.projectFlags?.dispatchingDisabled,
              true
            ),
            title: "Dispatching",
            type: ["boolean", "null"],
          },
          patch: {
            description:
              "Sets if users are allowed to create patches for this branch.",
            properties: {
              patchingDisabled: {
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.projectFlags?.patch?.patchingDisabled,
                  true
                ),
                title: "Patching",
                type: ["boolean", "null"],
              },
            },
            title: "Patch Settings",
            type: "object" as "object",
          },
          repotracker: {
            properties: {
              forceRun: {
                type: "null" as "null",
              },
              repotrackerDisabled: {
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.projectFlags?.repotracker?.repotrackerDisabled,
                  true
                ),
                title: "Repotracker",
                type: ["boolean", "null"],
              },
            },
            title: "Repotracker Settings",
            type: "object" as "object",
          },
          scheduling: {
            properties: {
              deactivatePrevious: {
                oneOf: radioBoxOptions(
                  ["Unschedule", "Don't Unschedule"],
                  repoData?.projectFlags?.scheduling?.deactivatePrevious
                ),
                title: "Old Task on Success",
                type: ["boolean", "null"],
              },
              deactivateStepback: {
                type: "null" as "null",
              },
              stepbackDisabled: {
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.projectFlags?.scheduling?.stepbackDisabled,
                  true
                ),
                title: "Stepback",
                type: ["boolean", "null"],
              },
            },
            title: "Scheduling Settings",
            type: "object" as "object",
          },
          taskSync: {
            properties: {
              configEnabled: {
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.projectFlags?.taskSync.configEnabled
                ),
                title: "Project Config Commands",
                type: ["boolean", "null"],
              },
              patchEnabled: {
                oneOf: radioBoxOptions(
                  ["Enabled", "Disabled"],
                  repoData?.projectFlags?.taskSync.patchEnabled
                ),
                title: "Task in Patches",
                type: ["boolean", "null"],
              },
            },
            title: "Task Sync",
            type: "object" as "object",
          },
        },
        title: "Project Flags",
        type: "object" as "object",
      },
      ...(projectType === ProjectType.AttachedProject && {
        delete: {
          properties: {
            deleteProject: {
              type: "null" as "null",
            },
          },
          title: "Delete Project",
          type: "object" as "object",
        },
      }),
    },
    type: "object" as "object",
  },
  uiSchema: {
    delete: {
      deleteProject: {
        options: { projectId },
        "ui:field": "deleteProjectField",
        "ui:showLabel": false,
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "removeProject",
    },
    generalConfiguration: {
      branch: {
        ...placeholderIf(repoData?.generalConfiguration?.branch),
      },
      enabled: {
        "ui:data-cy": "enabled-radio-box",
        "ui:showLabel": false,
        "ui:widget": widgets.RadioBoxWidget,
      },
      other: {
        batchTime: {
          "ui:data-cy": "batch-time-input",
          "ui:description":
            "The interval of time (in minutes) that Evergreen should wait in between activating the latest version.",
          ...placeholderIf(repoData?.generalConfiguration?.other?.batchTime),
        },
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
        remotePath: {
          "ui:description":
            "Path to yaml file where project tasks, variants, and other settings are defined.",
          ...placeholderIf(repoData?.generalConfiguration?.other?.remotePath),
        },
        spawnHostScriptPath: {
          "ui:data-cy": "spawn-host-input",
          "ui:description":
            "This is the bash setup script to optionally run on spawn hosts created from tasks.",
          "ui:optional": true,
          ...placeholderIf(
            repoData?.generalConfiguration?.other?.spawnHostScriptPath
          ),
        },
        versionControlEnabled: {
          "ui:description": VersionControlEnabledDescription,
          "ui:widget": widgets.RadioBoxWidget,
        },
      },
      repositoryInfo: {
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
        "ui:disabled": projectType !== ProjectType.Project,
        "ui:field": "repoConfigField",
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "generalConfiguration",
    },
    historicalTaskDataCaching: {
      disabledStatsCache: {
        "ui:description":
          "Task execution statistics aggregated by project, build variant, distro, task name, and task creation date.",
        "ui:widget": widgets.RadioBoxWidget,
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "historicalTaskDataCaching",
    },
    projectFlags: {
      dispatchingDisabled: {
        "ui:description": "Sets if any tasks can be dispatched.",
        "ui:widget": widgets.RadioBoxWidget,
      },
      patch: {
        patchingDisabled: {
          "ui:showLabel": false,
          "ui:widget": widgets.RadioBoxWidget,
        },
      },
      repotracker: {
        forceRun: {
          options: { projectId },
          "ui:field": "repotrackerField",
          "ui:showLabel": false,
        },
        repotrackerDisabled: {
          "ui:description": `The repotracker will be triggered from GitHub push events sent via webhook. 
            This creates mainline builds for merged commits.`,
          "ui:widget": widgets.RadioBoxWidget,
        },
      },
      scheduling: {
        deactivatePrevious: {
          "ui:description":
            "When unscheduled, tasks from previous revisions will be unscheduled when the equivalent task in a newer commit finishes successfully.",
          "ui:widget": widgets.RadioBoxWidget,
        },
        deactivateStepback: {
          options: { projectId },
          "ui:field": "deactivateStepbackTask",
          "ui:showLabel": false,
        },
        stepbackDisabled: {
          "ui:description":
            "Disabling this setting will override all enabled stepback settings for the project. Disabling stepback won't cancel any active stepback tasks, but it will prevent any future ones.",
          "ui:widget": widgets.RadioBoxWidget,
        },
      },
      taskSync: {
        configEnabled: {
          "ui:description":
            "Enable commands (e.g. s3.push, s3.pull) to sync the task directory in S3 from the config file.",
          "ui:widget": widgets.RadioBoxWidget,
        },
        patchEnabled: {
          "ui:description":
            "Users can create patches that sync the task directory to S3 at the end of any task.",
          "ui:widget": widgets.RadioBoxWidget,
        },
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "projectFlags",
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
  repoData: GeneralFormState,
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
      default:
        return 1;
    }
  }
  return 1;
};
