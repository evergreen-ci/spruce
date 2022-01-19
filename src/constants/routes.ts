import { PatchTab } from "types/patch";
import { PatchTasksQueryParams, TaskTab } from "types/task";
import { queryString } from "utils";

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
}
export const getVersionRoute = (
  versionId: string,
  options?: GetVersionRouteOptions
) => {
  const { tab, ...rest } = options || {};
  const queryParams = stringifyQuery({
    ...rest,
  });
  return `${paths.version}/${versionId}/${
    tab ?? DEFAULT_PATCH_TAB
  }?${queryParams}`;
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

export const getProjectPatchesRoute = (projectId: string) =>
  `${paths.project}/${projectId}/${PageNames.Patches}`;

export const getProjectSettingsRoute = (
  projectId: string,
  tab: ProjectSettingsTabRoutes
) => `${paths.project}/${projectId}/${PageNames.Settings}/${tab}`;

export const getCommitQueueRoute = (projectId: string) =>
  `${paths.commitQueue}/${projectId}`;

export const getCommitsRoute = (projectId: string = "") =>
  `${paths.commits}/${projectId}`;

export const getVariantHistoryRoute = (
  projectIdentifier: string,
  variantName: string
) => `${paths.variantHistory}/${projectIdentifier}/${variantName}`;

export const getTaskHistoryRoute = (
  projectIdentifier: string,
  taskName: string
) => `${paths.taskHistory}/${projectIdentifier}/${taskName}`;
