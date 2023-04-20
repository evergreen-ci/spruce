import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsQuery, RepoSettingsQuery } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { FormState } from "./types";

type Tab = ProjectSettingsTabRoutes.Containers;

export const gqlToForm: GqlToFormFunction<Tab> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"]
) => {
  if (!data) return null;

  const { projectRef } = data;
  const { containerSizeDefinitions } = projectRef;

  return {
    containerSizeDefinitions: {
      variables: containerSizeDefinitions,
    },
  };
};

export const formToGql: FormToGqlFunction<Tab> = (
  props: FormState,
  id: string
) => {
  const { containerSizeDefinitions } = props;
  console.log("formToGql", { containerSizeDefinitions });
  return {
    projectRef: {
      id,
      containerSizeDefinitions: containerSizeDefinitions.variables,
    },
  };
};
