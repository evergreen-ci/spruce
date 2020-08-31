import { PatchTasksQueryParams } from "types/task";

enum PageNames {
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

export const paths = {
  commitQueue: "/commit-queue",
  host: "/host",
  hosts: "/hosts",
  login: "/login",
  patch: "/patch",
  preferences: "/preferences",
  spawn: "/spawn",
  task: "/task",
  user: "/user",
  version: "/version",
  taskQueue: "/task-queue",
};

export const routes = {
  commitQueue: `${paths.commitQueue}/:id`,
  configurePatch: `${paths.patch}/:id/configure/:tab?`,
  host: `${paths.host}/:id`,
  hosts: paths.hosts,
  login: paths.login,
  myPatches: `${paths.user}/${PageNames.Patches}`,
  patch: `${paths.patch}/:id/:tab?`,
  preferences: `${paths.preferences}/:tab?`,
  spawn: `${paths.spawn}/:tab?`,
  spawnHost: `${paths.spawn}/${SpawnTab.Host}`,
  spawnVolume: `${paths.spawn}/${SpawnTab.Volume}`,
  task: `${paths.task}/:id/:tab?`,
  userPatches: `${paths.user}/:id/${PageNames.Patches}`,
  version: `${paths.version}/:id/:tab?`,
  profilePreferences: [`${paths.preferences}/${PreferencesTabRoutes.Profile}`],
  notificationsPreferences: `${paths.preferences}/${PreferencesTabRoutes.Notifications}`,
  cliPreferences: `${paths.preferences}/${PreferencesTabRoutes.CLI}`,
  newUIPreferences: `${paths.preferences}/${PreferencesTabRoutes.NewUI}`,
  publicKeysPreferences: `${paths.preferences}/${PreferencesTabRoutes.PublicKeys}`,
  taskQueue: `${paths.taskQueue}/:distro?`,
};

export enum PatchTab {
  Tasks = "tasks",
  Changes = "changes",
}

export const DEFAULT_PATCH_TAB = PatchTab.Tasks;

export const getBuildStatusIconLink = (patchId: string, buildVariant: string) =>
  `${paths.version}/${patchId}/${DEFAULT_PATCH_TAB}?${PatchTasksQueryParams.Variant}=${buildVariant}`;

export const getUserPatchesRoute = (userId: string): string =>
  `${paths.user}/${userId}/${PageNames.Patches}`;

export const getVersionRoute = (versionId: string, tab?: PatchTab) =>
  `${paths.version}/${versionId}/${tab ?? DEFAULT_PATCH_TAB}`;

export const getHostRoute = (hostId: string) => `${paths.host}/${hostId}`;

export const getTaskRoute = (taskId: string) => `${paths.task}/${taskId}`;

export const getPreferencesRoute = (tab: PreferencesTabRoutes) =>
  `${paths.preferences}/${tab}`;

export const getTaskQueueRoute = (distro: string) =>
  `${paths.taskQueue}/${distro}`;
