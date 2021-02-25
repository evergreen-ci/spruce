import { PatchTab } from "types/patch";
import { PatchTasksQueryParams, TaskTab } from "types/task";
import { stringifyQuery } from "utils";

export enum PageNames {
  Patches = "patches",
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

const paths = {
  commitQueue: "/commit-queue",
  host: "/host",
  hosts: "/hosts",
  login: "/login",
  patch: "/patch",
  preferences: "/preferences",
  project: "/project",
  spawn: "/spawn",
  task: "/task",
  taskQueue: "/task-queue",
  user: "/user",
  version: "/version",
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
  userPatches: `${paths.user}/:id/${PageNames.Patches}`,
  version: `${paths.version}/:id/:tab?`,
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

export const getCommitQueueRoute = (projectId: string) =>
  `${paths.commitQueue}/${projectId}`;
