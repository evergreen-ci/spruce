import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectTriggersSettingsFragment } from "gql/generated/types";
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

export const gqlToForm = ((data, { projectType }) => {
  if (!data) return null;

  const {
    projectRef: { triggers },
  } = data;

  return {
    triggers:
      triggers?.map((trigger) =>
        omitTypename({
          ...trigger,
          displayTitle: getTitle(trigger),
          level: trigger.level as ProjectTriggerLevel,
        })
      ) ?? [],
    triggersOverride: projectType !== ProjectType.AttachedProject || !!triggers,
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ triggers, triggersOverride }, projectId) => ({
  projectRef: {
    id: projectId,
    triggers: triggersOverride
      ? triggers.map((trigger) => ({
          alias: trigger.alias,
          buildVariantRegex: trigger.buildVariantRegex,
          configFile: trigger.configFile,
          dateCutoff: trigger.dateCutoff,
          level: trigger.level,
          project: trigger.project,
          status: trigger.status,
          taskRegex: trigger.taskRegex,
        }))
      : null,
  },
})) satisfies FormToGqlFunction<Tab>;
