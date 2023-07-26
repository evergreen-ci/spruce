import { ProjectSettingsTabRoutes } from "constants/routes";
import { string } from "utils";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";

const { omitTypename } = string;

type Tab = ProjectSettingsTabRoutes.VirtualWorkstation;

export const gqlToForm = ((data, options) => {
  if (!data) return null;

  const {
    projectRef: {
      workstationConfig: { gitClone, setupCommands },
    },
  } = data;
  const { projectType } = options;

  return {
    commands: {
      setupCommands: setupCommands?.map(omitTypename) ?? [],
      setupCommandsOverride:
        projectType !== ProjectType.AttachedProject || !!setupCommands,
    },
    gitClone,
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { commands: { setupCommands, setupCommandsOverride }, gitClone },
  id
) => ({
  projectRef: {
    id,
    workstationConfig: {
      gitClone,
      setupCommands: setupCommandsOverride ? setupCommands : null,
    },
  },
})) satisfies FormToGqlFunction<Tab>;
