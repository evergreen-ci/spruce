import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = ProjectSettingsTabRoutes.Access;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { projectRef } = data;
  return {
    accessSettings: {
      restricted: projectRef.restricted,
    },
    admin: {
      admins: projectRef.admins ?? [],
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ accessSettings, admin }, id) => {
  const projectRef: ProjectInput = {
    id,
    restricted: accessSettings.restricted,
    admins: admin.admins,
  };

  return { projectRef };
}) satisfies FormToGqlFunction<Tab>;
