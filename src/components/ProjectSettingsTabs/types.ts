import { FormDataProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  ProjectSettingsInput,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";

export type TabDataProps = Record<
  CompletedRoutes,
  {
    projectData: FormDataProps;
    repoData: FormDataProps;
  }
>;

export type GqlToFormFunction = (
  data:
    | ProjectSettingsQuery["projectSettings"]
    | RepoSettingsQuery["repoSettings"]
) => FormDataProps;

export type FormToGqlFunction = (
  form: FormDataProps,
  id?: string,
  options?: {
    useRepoSettings?: boolean;
  }
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
