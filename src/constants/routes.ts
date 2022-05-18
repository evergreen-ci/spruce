import { TestStatus, HistoryQueryParams } from "types/history";
import { PatchTab } from "types/patch";
import { PatchTasksQueryParams, TaskTab } from "types/task";
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
}

const paths = {
  commitQueue: "/commit-queue",
  host: "/host",
  hosts: "/hosts",
  login: "/login",
  patch: "/patch",
  preferences: "/preferences",
  project: "/project",
  projects: "/projects",
  spawn: "/spawn",
  task: "/task",
  taskQueue: "/task-queue",
  user: "/user",
  version: "/version",
  commits: "/commits",
  variantHistory: "/variant-history",
  taskHistory: "/task-history",
  jobLogs: "/job-logs",
};

const projectSettingsSlug = `${paths.project}/:identifier/${PageNames.Settings}`;

const projectSettingsRoutes = {
  projectSettings: `${projectSettingsSlug}/:tab?`,
  projectSettingsAccess: `${projectSettingsSlug}/${ProjectSettingsTabRoutes.Access}`,
  projectSettingsGeneral: `${projectSettingsSlug}/${ProjectSettingsTabRoutes.General}`,
  projectSettingsGithubCommitQueue: `${projectSettingsSlug}/${ProjectSettingsTabRoutes.GithubCommitQueue}`,
  projectSettingsEventLog: `${projectSettingsSlug}/${ProjectSettingsTabRoutes.EventLog}`,
  projectSettingsPlugins: `${projectSettingsSlug}/${ProjectSettingsTabRoutes.Plugins}`,
  projectSettingsNotifications: `${projectSettingsSlug}/${ProjectSettingsTabRoutes.Notifications}`,
  projectSettingsPatchAliases: `${projectSettingsSlug}/${ProjectSettingsTabRoutes.PatchAliases}`,
  projectSettingsPeriodicBuilds: `${projectSettingsSlug}/${ProjectSettingsTabRoutes.PeriodicBuilds}`,
  projectSettingsProjectTriggers: `${projectSettingsSlug}/${ProjectSettingsTabRoutes.ProjectTriggers}`,
  projectSettingsVariables: `${projectSettingsSlug}/${ProjectSettingsTabRoutes.Variables}`,
  projectSettingsVirtualWorkstation: `${projectSettingsSlug}/${ProjectSettingsTabRoutes.VirtualWorkstation}`,
};

export const routes = {
  cliPreferences: `${paths.preferences}/${PreferencesTabRoutes.CLI}`,
  commitQueue: `${paths.commitQueue}/:id`,
  configurePatch: `${paths.patch}/:id/configure/:tab?`,
  host: `${paths.host}/:id`,
  hosts: paths.hosts,
  login: paths.login,
  myPatches: `${paths.user}/${PageNames.Patches}`,
  newUIPreferences: `${paths.preferences}/${PreferencesTabRoutes.NewUI}`,
  notificationsPreferences: `${paths.preferences}/${PreferencesTabRoutes.Notifications}`,
  patch: `${paths.patch}/:id/:tab?`,
  preferences: `${paths.preferences}/:tab?`,
  profilePreferences: [`${paths.preferences}/${PreferencesTabRoutes.Profile}`],
  projectPatches: `${paths.project}/:id/${PageNames.Patches}`,
  publicKeysPreferences: `${paths.preferences}/${PreferencesTabRoutes.PublicKeys}`,
  spawn: `${paths.spawn}/:tab?`,
  spawnHost: `${paths.spawn}/${SpawnTab.Host}`,
  spawnVolume: `${paths.spawn}/${SpawnTab.Volume}`,
  task: `${paths.task}/:id/:tab?`,
  taskQueue: `${paths.taskQueue}/:distro?/:taskId?`,
  userPatchesRedirect: `${paths.user}/:id`,
  projectSettingsRedirect: paths.projects,
  userPatches: `${paths.user}/:id/${PageNames.Patches}`,
  version: `${paths.version}/:id/:tab?`,
  commits: `${paths.commits}/:id?`,
  variantHistory: `${paths.variantHistory}/:projectId/:variantName`,
  taskHistory: `${paths.taskHistory}/:projectId/:taskName`,
  jobLogs: `${paths.jobLogs}/:taskId/:execution/:groupId?`,
  ...projectSettingsRoutes,
};

export const DEFAULT_PATCH_TAB = PatchTab.Tasks;

export const getBuildStatusIconLink = (patchId: string, buildVariant: string) =>
  `${paths.version}/${patchId}/${DEFAULT_PATCH_TAB}?${PatchTasksQueryParams.Variant}=${buildVariant}`;

export const getUserPatchesRoute = (userId: string): string =>
  `${paths.user}/${userId}/${PageNames.Patches}`;

interface GetVersionRouteOptions {
  tab?: PatchTab;
  variant?: string;
  page?: number;
  statuses?: string[];
  sorts?: string | string[];
}
export const getVersionRoute = (
  versionId: string,
  options?: GetVersionRouteOptions
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
  options: GetPatchRouteOptions
) => {
  const { tab, configure, ...rest } = options || {};
  const queryParams = stringifyQuery({
    ...rest,
  });
  if (!configure) return getVersionRoute(patchId);
  return `${paths.patch}/${patchId}/${PatchTab.Configure}/${
    tab ?? DEFAULT_PATCH_TAB
  }?${queryParams}`;
};

export const getHostRoute = (hostId: string) => `${paths.host}/${hostId}`;

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

interface GetTaskRouteOptions {
  tab?: TaskTab;
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

export const getTaskQueueRoute = (distro: string, taskId?: string) =>
  `${paths.taskQueue}/${distro}${taskId ? `/${taskId}` : ""}`;

interface GetSpawnHostRouteParam {
  distroId?: string;
  host?: string;
  taskId?: string;
  spawnHost?: boolean;
}
export const getSpawnHostRoute = ({
  distroId,
  host,
  taskId,
  spawnHost,
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
  `${paths.project}/${projectIdentifier}/${PageNames.Patches}`;

export const getProjectSettingsRoute = (
  projectId: string,
  tab?: ProjectSettingsTabRoutes
) => {
  if (!tab) {
    return `${paths.project}/${projectId}/${PageNames.Settings}`;
  }

  return `${paths.project}/${projectId}/${PageNames.Settings}/${tab}`;
};

export const getCommitQueueRoute = (projectId: string) =>
  `${paths.commitQueue}/${projectId}`;

export const getCommitsRoute = (projectId: string = "") =>
  `${paths.commits}/${projectId}`;

const getHistoryRoute = (
  basePath: string,
  filters?: {
    failingTests?: string[];
    passingTests?: string[];
  },
  selectedCommit?: number
) => {
  if (filters || selectedCommit) {
    const failingTests = toArray(filters?.failingTests);
    const passingTests = toArray(filters?.passingTests);

    const queryParams = stringifyQuery({
      [TestStatus.Failed]: failingTests,
      [TestStatus.Passed]: passingTests,
      [HistoryQueryParams.SelectedCommit]: selectedCommit,
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
  }
) => {
  const { filters, selectedCommit } = options || {};
  return getHistoryRoute(
    `${paths.variantHistory}/${projectIdentifier}/${variantName}`,
    filters,
    selectedCommit
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
  }
) => {
  const { filters, selectedCommit } = options || {};

  return getHistoryRoute(
    `${paths.taskHistory}/${projectIdentifier}/${taskName}`,
    filters,
    selectedCommit
  );
};
