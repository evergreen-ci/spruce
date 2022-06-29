import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  ProjectSettingsQuery,
  ProjectTriggersSettingsFragment,
  RepoSettingsQuery,
} from "gql/generated/types";
import { ProjectTriggerLevel } from "types/triggers";
import { Unpacked } from "types/utils";
import { string } from "utils";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";

const { omitTypename } = string;

type Tab = ProjectSettingsTabRoutes.ProjectTriggers;

const getTitle = ({
  level,
  project,
  status,
}: Unpacked<ProjectTriggersSettingsFragment["triggers"]>) =>
  `${project}: On ${level}${status === "all" ? "" : ` ${status}`}`;

export const gqlToForm: GqlToFormFunction<Tab> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"],
  { projectType }: { projectType: ProjectType }
) => {
  if (!data) return null;

  const {
    projectRef: { triggers },
  } = data;

  return {
    triggersOverride: projectType !== ProjectType.AttachedProject || !!triggers,
    triggers:
      triggers?.map((trigger) =>
        omitTypename({
          ...trigger,
          level: trigger.level as ProjectTriggerLevel,
          displayTitle: getTitle(trigger),
        })
      ) ?? [],
  };
};

export const formToGql: FormToGqlFunction<Tab> = (
  { triggersOverride, triggers },
  projectId
) => ({
  projectRef: {
    id: projectId,
    triggers: triggersOverride
      ? triggers.map((trigger) => ({
          project: trigger.project,
          level: trigger.level,
          buildVariantRegex: trigger.buildVariantRegex,
          taskRegex: trigger.taskRegex,
          status: trigger.status,
          dateCutoff: trigger.dateCutoff || 0,
          configFile: trigger.configFile,
          alias: trigger.alias,
        }))
      : null,
  },
});
