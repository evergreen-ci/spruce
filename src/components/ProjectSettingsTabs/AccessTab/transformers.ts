import {
  ProjectInput,
  ProjectSettingsInput,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import { FormState } from "./types";

export const gqlToForm = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"]
): FormState => {
  if (!data) return null;

  const { projectRef } = data;
  return {
    accessSettings: {
      private: projectRef.private,
      restricted: projectRef.restricted,
    },
    admin: {
      admins: projectRef.admins
        ? projectRef.admins.map((username) => ({ username }))
        : null,
    },
  };
};

export const formToGql = (
  { accessSettings, admin }: FormState,
  id: string
): Pick<ProjectSettingsInput, "projectRef"> => {
  const filteredAdmins =
    admin?.admins?.map(({ username }) => username).filter((str) => !!str) || [];

  const projectRef: ProjectInput = {
    id,
    private: accessSettings.private,
    restricted: accessSettings.restricted,
    admins: filteredAdmins.length ? filteredAdmins : null,
  };

  return { projectRef };
};
