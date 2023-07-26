import { ProjectSettingsTabRoutes } from "constants/routes";
import { PeriodicBuild } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";
import { IntervalSpecifier } from "./types";

type Tab = ProjectSettingsTabRoutes.PeriodicBuilds;

const getTitle = (
  definition: Pick<PeriodicBuild, "cron" | "intervalHours" | "message">
) => {
  if (!definition) {
    return "";
  }
  const { cron, intervalHours, message } = definition;
  if (message) {
    return message;
  }
  return intervalHours ? `Every ${intervalHours} hours` : cron;
};

export const gqlToForm = ((data, { projectType }) => {
  if (!data) return null;

  const {
    projectRef: { periodicBuilds },
  } = data;

  return {
    periodicBuilds:
      periodicBuilds?.map(
        ({
          alias,
          configFile,
          cron,
          id,
          intervalHours,
          message,
          nextRunTime,
        }) => ({
          alias,
          configFile,
          displayTitle: getTitle({ cron, intervalHours, message }),
          id,
          interval:
            cron === ""
              ? {
                  cron: "",
                  intervalHours,
                  specifier: IntervalSpecifier.Hours,
                }
              : {
                  cron,
                  intervalHours: null,
                  specifier: IntervalSpecifier.Cron,
                },
          message,
          nextRunTime: nextRunTime.toString(),
        })
      ) ?? [],
    periodicBuildsOverride:
      projectType !== ProjectType.AttachedProject || !!periodicBuilds,
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { periodicBuilds, periodicBuildsOverride },
  projectId
) => ({
  projectRef: {
    id: projectId,
    periodicBuilds: periodicBuildsOverride
      ? periodicBuilds.map(
          ({ alias, configFile, id, interval, message, nextRunTime }) => ({
            alias,
            configFile,
            id: id || "",
            message,
            nextRunTime: new Date(nextRunTime),
            ...(interval.specifier === IntervalSpecifier.Cron
              ? {
                  cron: interval.cron,
                  intervalHours: 0,
                }
              : {
                  cron: "",
                  intervalHours: interval.intervalHours,
                }),
          })
        )
      : null,
  },
})) satisfies FormToGqlFunction<Tab>;
