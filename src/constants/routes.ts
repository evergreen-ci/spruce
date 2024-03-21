import { getGithubCommitUrl } from "constants/externalResources";
import { TestStatus, HistoryQueryParams } from "types/history";
import { PatchTab } from "types/patch";
import { PatchTasksQueryParams, TaskTab } from "types/task";
import { ProjectTriggerLevel } from "types/triggers";
import { queryString, array } from "utils";

const { toArray } = array;
const { stringifyQuery } = queryString;

export enum PageNames {
  Patches = "patches",
  Settings = "settings",
}

export enum SpawnTab {
  Host = "host",
  Volume = "volume",
}

export enum PreferencesTabRoutes {
  Profile = "profile",
  Notifications = "notifications",
  CLI = "cli",
  NewUI = "newUI",
  PublicKeys = "publickeys",
}

export enum ProjectSettingsTabRoutes {
  General = "general",
  Access = "access",
  Variables = "variables",
  GithubCommitQueue = "github-commitqueue",
  Notifications = "notifications",
  PatchAliases = "patch-aliases",
  VirtualWorkstation = "virtual-workstation",
  ProjectTriggers = "project-triggers",
  PeriodicBuilds = "periodic-builds",
  Plugins = "plugins",
  EventLog = "event-log",
  Containers = "containers",
  ViewsAndFilters = "views-and-filters",
}

export enum DistroSettingsTabRoutes {
  General = "general",
  Provider = "provider",
  Task = "task",
  Host = "host",
  Project = "project",
  EventLog = "event-log",
}

const paths = {
  commitQueue: "/commit-queue",
  commits: "/commits",
  container: "/container",
  distro: "/distro",
  distros: "/distros",
  host: "/host",
  hosts: "/hosts",
  jobLogs: "/job-logs",
  login: "/login",
  patch: "/patch",
  preferences: "/preferences",
  project: "/project",
  projects: "/projects",
  spawn: "/spawn",
  task: "/task",
  taskHistory: "/task-history",
  taskQueue: "/task-queue",
  user: "/user",
  variantHistory: "/variant-history",
  version: "/version",
  waterfall: "/waterfall",
};

export enum slugs {
  buildId = "buildId",
  podId = "podId",
  distro = "distro",
  distroId = "distroId",
  hostId = "hostId",
  id = "id",
  patchId = "patchId",
  projectIdentifier = "projectIdentifier",
  tab = "tab",
  taskId = "taskId",
  taskName = "taskName",
  variantName = "variantName",
  versionId = "versionId",
}

export const redirectRoutes = {
  distroSettings: paths.distros,
  projectSettings: paths.projects,
  userPatches: `${paths.user}/:${slugs.id}`,
  waterfall: `${paths.waterfall}/:${slugs.projectIdentifier}`,
};

export const routes = {
  commitQueue: `${paths.commitQueue}/:${slugs.projectIdentifier}`,
  commits: paths.commits,
  configurePatch: `${paths.patch}/:${slugs.patchId}/configure`,
  container: `${paths.container}/:${slugs.podId}`,
  distroSettings: `${paths.distro}/:${slugs.distroId}/${PageNames.Settings}`,
  host: `${paths.host}/:${slugs.hostId}`,
  hosts: paths.hosts,
  jobLogs: `${paths.jobLogs}/:${slugs.buildId}`,
  jobLogsGroup: `${paths.jobLogs}/:${slugs.taskId}`,
  login: paths.login,
  myPatches: `${paths.user}/${PageNames.Patches}`,
  patch: `${paths.patch}/:${slugs.versionId}`,
  preferences: paths.preferences,
  projectPatches: `${paths.project}/:${slugs.projectIdentifier}/${PageNames.Patches}`,
  projectSettings: `${paths.project}/:${slugs.projectIdentifier}/${PageNames.Settings}`,
  spawn: paths.spawn,
  spawnHost: `${paths.spawn}/${SpawnTab.Host}`,
  spawnVolume: `${paths.spawn}/${SpawnTab.Volume}`,
  task: `${paths.task}/:${slugs.taskId}`,
  taskHistory: `${paths.taskHistory}/:${slugs.projectIdentifier}/:${slugs.taskName}`,
  taskQueue: paths.taskQueue,
  user: `${paths.user}/*`,
  userPatches: `${paths.user}/:${slugs.id}/${PageNames.Patches}`,
  variantHistory: `${paths.variantHistory}/:${slugs.projectIdentifier}/:${slugs.variantName}`,
  version: `${paths.version}/:${slugs.versionId}`,
};

export const DEFAULT_PATCH_TAB = PatchTab.Tasks;

export const getBuildStatusIconLink = (patchId: string, buildVariant: string) =>
  `${paths.version}/${patchId}/${DEFAULT_PATCH_TAB}?${PatchTasksQueryParams.Variant}=${buildVariant}`;

export const getUserPatchesRoute = (userId: string): string =>
  `${paths.user}/${userId}/${PageNames.Patches}`;

export interface GetVersionRouteOptions {
  tab?: PatchTab;
  variant?: string;
  page?: number;
  statuses?: string[];
  sorts?: string | string[];
}
export const getVersionRoute = (
  versionId: string,
  options?: GetVersionRouteOptions,
) => {
  const { tab, ...rest } = options || {};
  const queryParams = stringifyQuery({
    ...rest,
  });
  return `${paths.version}/${versionId}/${tab ?? DEFAULT_PATCH_TAB}${
    queryParams && `?${queryParams}`
  }`;
};

interface GetPatchRouteOptions {
  tab?: string;
  configure: boolean;
}

export const getPatchRoute = (
  patchId: string,
  options: GetPatchRouteOptions,
) => {
  const { configure, tab, ...rest } = options || {};
  const queryParams = stringifyQuery({
    ...rest,
  });
  if (!configure) return getVersionRoute(patchId);
  return `${paths.patch}/${patchId}/${PatchTab.Configure}/${
    tab ?? DEFAULT_PATCH_TAB
  }${queryParams && `?${queryParams}`}`;
};

export const getHostRoute = (hostId: string) => `${paths.host}/${hostId}`;

export const getPodRoute = (podId: string) => `${paths.container}/${podId}`;

interface GetAllHostsRouteOptions {
  hostId?: string;
  distroId?: string;
  statuses?: string[];
  currentTaskId?: string;
}

export const getAllHostsRoute = (options?: GetAllHostsRouteOptions) => {
  const { ...rest } = options || {};
  const queryParams = stringifyQuery({
    ...rest,
  });
  return `${paths.hosts}?${queryParams}`;
};

export interface GetTaskRouteOptions {
  tab?: TaskTab;
  execution?: number;
  [key: string]: any;
}
export const getTaskRoute = (taskId: string, options?: GetTaskRouteOptions) => {
  const { tab, ...rest } = options || {};
  const queryParams = stringifyQuery({
    ...rest,
  });
  return `${paths.task}/${taskId}${tab ? `/${tab}` : ""}${
    queryParams ? `?${queryParams}` : ""
  }`;
};
export const getPreferencesRoute = (tab?: PreferencesTabRoutes) =>
  `${paths.preferences}/${tab}`;

export const getTaskQueueRoute = (distro: string, taskId?: string) => {
  const queryParams = stringifyQuery({
    taskId,
  });
  return `${paths.taskQueue}/${distro}${taskId ? `?${queryParams}` : ""}`;
};
interface GetSpawnHostRouteParam {
  distroId?: string;
  host?: string;
  taskId?: string;
  spawnHost?: boolean;
}
export const getSpawnHostRoute = ({
  distroId,
  host,
  spawnHost,
  taskId,
}: GetSpawnHostRouteParam) => {
  const queryParams = stringifyQuery({
    ...(spawnHost && { spawnHost: "True" }),
    distroId,
    taskId,
    host,
  });
  return `${routes.spawnHost}?${queryParams}`;
};

export const getSpawnVolumeRoute = (volume: string) => {
  const queryParams = stringifyQuery({
    volume,
  });
  return `${routes.spawnVolume}?${queryParams}`;
};

export const getProjectPatchesRoute = (projectIdentifier: string) =>
  `${paths.project}/${encodeURIComponent(projectIdentifier)}/${
    PageNames.Patches
  }`;

export const getProjectSettingsRoute = (
  projectId: string,
  tab?: ProjectSettingsTabRoutes,
) => {
  // Encode projectId for backwards compatibilty.
  // Encoding can be removed when all projectIDs
  // are URL friendly withou encoding
  const encodedProjectId = encodeURIComponent(projectId);
  const root = `${paths.project}/${encodedProjectId}/${PageNames.Settings}`;
  return tab ? `${root}/${tab}` : root;
};

export const getDistroSettingsRoute = (
  distroId: string,
  tab?: DistroSettingsTabRoutes,
) =>
  tab
    ? `${paths.distro}/${distroId}/${PageNames.Settings}/${tab}`
    : `${paths.distro}/${distroId}/${PageNames.Settings}/${DistroSettingsTabRoutes.General}`;

export const getCommitQueueRoute = (projectIdentifier: string) =>
  `${paths.commitQueue}/${encodeURIComponent(projectIdentifier)}`;

export const getCommitsRoute = (projectIdentifier: string = "") =>
  `${paths.commits}/${encodeURIComponent(projectIdentifier)}`;

const getHistoryRoute = (
  basePath: string,
  filters?: {
    failingTests?: string[];
    passingTests?: string[];
  },
  selectedCommit?: number,
  visibleColumns?: string[],
) => {
  if (filters || selectedCommit) {
    const failingTests = toArray(filters?.failingTests);
    const passingTests = toArray(filters?.passingTests);

    const queryParams = stringifyQuery({
      [TestStatus.Failed]: failingTests,
      [TestStatus.Passed]: passingTests,
      [HistoryQueryParams.SelectedCommit]: selectedCommit,
      [HistoryQueryParams.VisibleColumns]: visibleColumns,
    });
    return `${basePath}?${queryParams}`;
  }
  return basePath;
};
export const getVariantHistoryRoute = (
  projectIdentifier: string,
  variantName: string,
  options?: {
    filters?: {
      failingTests?: string[];
      passingTests?: string[];
    };
    selectedCommit?: number;
  },
) => {
  const { filters, selectedCommit } = options || {};
  return getHistoryRoute(
    `${paths.variantHistory}/${encodeURIComponent(
      projectIdentifier,
    )}/${variantName}`,
    filters,
    selectedCommit,
  );
};

export const getTaskHistoryRoute = (
  projectIdentifier: string,
  taskName: string,
  options?: {
    filters?: {
      failingTests?: string[];
      passingTests?: string[];
    };
    selectedCommit?: number;
    visibleColumns?: string[];
  },
) => {
  const { filters, selectedCommit, visibleColumns } = options || {};

  return getHistoryRoute(
    `${paths.taskHistory}/${encodeURIComponent(projectIdentifier)}/${taskName}`,
    filters,
    selectedCommit,
    visibleColumns,
  );
};

interface GetTriggerRouteParams {
  triggerType: string;
  upstreamTask: any;
  upstreamVersion: any;
  upstreamRevision: string;
  upstreamOwner: string;
  upstreamRepo: string;
}

export const getTriggerRoute = ({
  triggerType,
  upstreamOwner,
  upstreamRepo,
  upstreamRevision,
  upstreamTask,
  upstreamVersion,
}: GetTriggerRouteParams) => {
  if (triggerType === ProjectTriggerLevel.TASK) {
    return getTaskRoute(upstreamTask.id);
  }
  if (triggerType === ProjectTriggerLevel.PUSH) {
    return getGithubCommitUrl(upstreamOwner, upstreamRepo, upstreamRevision);
  }
  return getVersionRoute(upstreamVersion.id);
};
