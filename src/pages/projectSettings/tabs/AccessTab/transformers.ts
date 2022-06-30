import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectInput } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { FormState } from "./types";

type Tab = ProjectSettingsTabRoutes.Access;

export const gqlToForm: GqlToFormFunction<Tab> = (data) => {
  if (!data) return null;

  const { projectRef } = data;
  return {
    accessSettings: {
      private: projectRef.private,
      restricted: projectRef.restricted,
    },
    admin: {
      admins: projectRef.admins ?? [],
    },
  };
};

export const formToGql: FormToGqlFunction<Tab> = (
  { accessSettings, admin }: FormState,
  id: string
) => {
  const projectRef: ProjectInput = {
    id,
    private: accessSettings.private,
    restricted: accessSettings.restricted,
    admins: admin.admins,
  };

  return { projectRef };
};
