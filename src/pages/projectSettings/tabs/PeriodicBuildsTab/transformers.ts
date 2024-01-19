import { ProjectSettingsTabRoutes } from "constants/routes";
import { PeriodicBuild } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";
import { IntervalSpecifier } from "./types";

type Tab = ProjectSettingsTabRoutes.PeriodicBuilds;

const getTitle = (
  definition: Pick<PeriodicBuild, "cron" | "intervalHours" | "message">,
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
    periodicBuildsOverride:
      projectType !== ProjectType.AttachedProject || !!periodicBuilds,
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
          id,
          message,
          nextRunTime: nextRunTime.toString(),
          displayTitle: getTitle({ cron, intervalHours, message }),
          interval:
            cron === ""
              ? {
                  specifier: IntervalSpecifier.Hours,
                  cron: "",
                  intervalHours,
                }
              : {
                  specifier: IntervalSpecifier.Cron,
                  intervalHours: null,
                  cron,
                },
        }),
      ) ?? [],
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { periodicBuilds, periodicBuildsOverride },
  projectId,
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
          }),
        )
      : null,
  },
})) satisfies FormToGqlFunction<Tab>;
