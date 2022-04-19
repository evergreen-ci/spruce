import { FormDataProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  ProjectSettingsInput,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import { ProjectType } from "./utils";

export type TabDataProps = Record<
  WritableTabRoutes,
  {
    projectData: FormDataProps;
    repoData: FormDataProps;
  }
>;

export type GqlToFormFunction<T = FormDataProps> = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"],
  options?: { projectType?: ProjectType }
) => T;

export type FormToGqlFunction<T = FormDataProps> = (
  form: T,
  id?: string
) => ProjectSettingsInput;

export const readOnlyTabs = [ProjectSettingsTabRoutes.EventLog] as const;

type ReadOnlyTabs = typeof readOnlyTabs[number];

export type WritableTabRoutes = Exclude<ProjectSettingsTabRoutes, ReadOnlyTabs>;
