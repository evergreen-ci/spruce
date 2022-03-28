import { ProjectSettingsQuery, RepoSettingsQuery } from "gql/generated/types";
import { string } from "utils";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";
import { FormState } from "./types";

const { omitTypename } = string;

export const gqlToForm: GqlToFormFunction<FormState> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"],
  options: { projectType: ProjectType }
): ReturnType<GqlToFormFunction> => {
  if (!data) return null;

  const {
    projectRef: {
      workstationConfig: { gitClone, setupCommands },
    },
  } = data;
  const { projectType } = options;

  return {
    gitClone,
    commands: {
      setupCommandsOverride:
        projectType !== ProjectType.AttachedProject || !!setupCommands,
      setupCommands: setupCommands?.map(omitTypename) ?? [],
    },
  };
};

export const formToGql: FormToGqlFunction = (
  { gitClone, commands: { setupCommandsOverride, setupCommands } }: FormState,
  id: string
): ReturnType<FormToGqlFunction> => ({
  projectRef: {
    id,
    workstationConfig: {
      gitClone,
      setupCommands: setupCommandsOverride ? setupCommands : null,
    },
  },
});
