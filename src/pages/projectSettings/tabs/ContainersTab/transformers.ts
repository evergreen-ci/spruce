import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  ProjectInput,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import { string } from "../../../../utils";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";
import { FormState } from "./types";

const { omitTypename } = string;

type Tab = ProjectSettingsTabRoutes.Containers;

export const gqlToForm: GqlToFormFunction<Tab> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"],
  { projectType }: { projectType: ProjectType }
) => {
  if (!data) return null;

  const {
    projectRef: { containerSizeDefinitions },
  } = data;

  return {
    containerSizeDefinitionsOverride:
      projectType !== ProjectType.AttachedProject || !!containerSizeDefinitions,
    containerSizeDefinitions:
      containerSizeDefinitions?.map((definition) =>
        omitTypename({
          ...definition,
        })
      ) ?? [],
  };
};

export const formToGql: FormToGqlFunction<Tab> = (
  { containerSizeDefinitions }: FormState,
  id
) => {
  const projectRef: ProjectInput = {
    id,
    containerSizeDefinitions,
  };

  return { projectRef };
};
