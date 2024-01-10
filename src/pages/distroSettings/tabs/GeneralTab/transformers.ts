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
    distroOptions: {
      isCluster,
      disableShallowClone,
      disabled,
      note,
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { distroAliases, distroName, distroOptions },
  distro,
) => ({
  ...distro,
  name: distroName.identifier,
  aliases: distroAliases.aliases,
  note: distroOptions.note,
  isCluster: distroOptions.isCluster,
  disableShallowClone: distroOptions.disableShallowClone,
  disabled: distroOptions.disabled,
})) satisfies FormToGqlFunction<Tab>;
