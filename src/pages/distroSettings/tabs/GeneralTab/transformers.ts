import { DistroSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = DistroSettingsTabRoutes.General;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { aliases, disableShallowClone, disabled, isCluster, name, note } =
    data;

  return {
    distroName: {
      identifier: name,
    },
    distroAliases: {
      aliases,
    },
    distroNote: {
      note,
    },
    distroOptions: {
      isCluster,
      disableShallowClone,
      disabled,
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { distroAliases, distroName, distroNote, distroOptions },
  id
) => ({
  name: distroName.identifier ?? id,
  aliases: distroAliases.aliases,
  note: distroNote.note,
  isCluster: distroOptions.isCluster,
  disableShallowClone: distroOptions.disableShallowClone,
  disabled: distroOptions.disabled,
})) satisfies FormToGqlFunction<Tab>;
