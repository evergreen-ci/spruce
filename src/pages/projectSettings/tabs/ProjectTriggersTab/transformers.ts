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
    triggersOverride: projectType !== ProjectType.AttachedProject || !!triggers,
    triggers:
      triggers?.map((trigger) =>
        omitTypename({
          ...trigger,
          level: trigger.level as ProjectTriggerLevel,
          displayTitle: getTitle(trigger),
        }),
      ) ?? [],
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ triggers, triggersOverride }, projectId) => ({
  projectRef: {
    id: projectId,
    triggers: triggersOverride
      ? triggers.map((trigger) => ({
          project: trigger.project,
          level: trigger.level,
          buildVariantRegex: trigger.buildVariantRegex,
          taskRegex: trigger.taskRegex,
          status: trigger.status,
          dateCutoff: trigger.dateCutoff,
          configFile: trigger.configFile,
          alias: trigger.alias,
          unscheduleDownstreamVersions: trigger.unscheduleDownstreamVersions,
        }))
      : null,
  },
})) satisfies FormToGqlFunction<Tab>;
