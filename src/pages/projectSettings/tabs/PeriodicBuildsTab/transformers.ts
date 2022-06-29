import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  PeriodicBuild,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import { string } from "utils";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";
import { FormState } from "./types";

const { omitTypename } = string;

type Tab = ProjectSettingsTabRoutes.PeriodicBuilds;

const getTitle = (definition: PeriodicBuild) => {
  if (!definition) {
    return "";
  }
  if (definition.message) {
    return definition.message;
  }
  return `Every ${definition.intervalHours} hours`;
};

export const gqlToForm: GqlToFormFunction<Tab> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"],
  { projectType }: { projectType: ProjectType }
) => {
  if (!data) return null;

  const {
    projectRef: { periodicBuilds },
  } = data;

  return {
    periodicBuildsOverride:
      projectType !== ProjectType.AttachedProject || !!periodicBuilds,
    periodicBuilds:
      periodicBuilds?.map((definition) =>
        omitTypename({
          ...definition,
          nextRunTime: definition.nextRunTime.toString(),
          displayTitle: getTitle(definition),
        })
      ) ?? [],
  };
};

export const formToGql: FormToGqlFunction<Tab> = (
  { periodicBuildsOverride, periodicBuilds }: FormState,
  projectId
) => ({
  projectRef: {
    id: projectId,
    periodicBuilds: periodicBuildsOverride
      ? periodicBuilds.map((build) => ({
          alias: build.alias,
          configFile: build.configFile,
          id: build.id || "",
          intervalHours: build.intervalHours,
          message: build.message,
          nextRunTime: new Date(build.nextRunTime),
        }))
      : null,
  },
});
