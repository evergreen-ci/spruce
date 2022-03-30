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

const getTitle = (definition: PeriodicBuild) => {
  if (!definition) {
    return "";
  }
  if (definition.message) {
    return definition.message;
  }
  return `Every ${definition.intervalHours} hours`;
};

export const gqlToForm: GqlToFormFunction<FormState> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"],
  { projectType }: { projectType: ProjectType }
): ReturnType<GqlToFormFunction> => {
  if (!data) return null;

  const {
    projectRef: { periodicBuilds },
  } = data;

  return {
    periodicBuildsOverride:
      projectType !== ProjectType.AttachedProject || !!periodicBuilds,
    periodicBuilds:
      omitTypename(periodicBuilds)?.map((definition) => ({
        ...definition,
        nextRunTime: definition.nextRunTime.toString(),
        displayTitle: getTitle(definition),
      })) ?? [],
  };
};

export const formToGql: FormToGqlFunction = (
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
