import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsQuery, RepoSettingsQuery } from "gql/generated/types";
import { string } from "utils";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";
import { FormState } from "./types";

const { omitTypename } = string;

type Tab = ProjectSettingsTabRoutes.VirtualWorkstation;

export const gqlToForm: GqlToFormFunction<Tab> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"],
  options: { projectType: ProjectType }
) => {
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

export const formToGql: FormToGqlFunction<Tab> = (
  { gitClone, commands: { setupCommandsOverride, setupCommands } }: FormState,
  id: string
) => ({
  projectRef: {
    id,
    workstationConfig: {
      gitClone,
      setupCommands: setupCommandsOverride ? setupCommands : null,
    },
  },
});
