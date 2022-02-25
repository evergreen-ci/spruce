import { FormDataProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  ProjectSettingsInput,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import { ProjectType } from "./utils";

export type TabDataProps = Record<
  CompletedRoutes,
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

export type FormToGqlFunction = (
  form: FormDataProps,
  id?: string
) => Partial<ProjectSettingsInput>;

export const readOnlyTabs = [ProjectSettingsTabRoutes.EventLog] as const;

type UnfinishedPages =
  | ProjectSettingsTabRoutes.VirtualWorkstation
  | ProjectSettingsTabRoutes.ProjectTriggers
  | ProjectSettingsTabRoutes.PeriodicBuilds
  | ProjectSettingsTabRoutes.EventLog;

type ReadOnlyTabs = typeof readOnlyTabs[number];

export type WritableTabRoutes = Exclude<ProjectSettingsTabRoutes, ReadOnlyTabs>;

export type CompletedRoutes = Exclude<WritableTabRoutes, UnfinishedPages>;
