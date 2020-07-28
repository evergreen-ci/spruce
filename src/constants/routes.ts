import { PatchTasksQueryParams } from "types/task";

enum PageNames {
  Patches = "patches",
}

export const paths = {
  login: "/login",
  task: "/task",
  patch: "/patch",
  version: "/version",
  commitQueue: "/commit-queue",
  preferences: "/preferences",
  user: "/user",
  hosts: "/hosts",
  host: "/host",
};

export const routes = {
  login: paths.login,
  myPatches: `${paths.user}/${PageNames.Patches}`,
  task: `${paths.task}/:id/:tab?`,
  patch: `${paths.patch}/:id/:tab?`,
  commitQueue: `${paths.commitQueue}/:id`,
  configurePatch: `${paths.patch}/:id/configure/:tab?`,
  preferences: `${paths.preferences}/:tab?`,
  userPatches: `${paths.user}/:id/${PageNames.Patches}`,
  version: `${paths.version}/:id/:tab?`,
  hosts: paths.hosts,
  host: paths.host,
};

export enum PatchTab {
  Tasks = "tasks",
  Changes = "changes",
}

export const DEFAULT_PATCH_TAB = PatchTab.Tasks;

export enum preferencesTabRoutes {
  Profile = "profile",
  Notifications = "notifications",
  CLI = "cli",
  NewUI = "newUI",
}

export const getBuildStatusIconLink = (patchId: string, buildVariant: string) =>
  `${paths.version}/${patchId}/${DEFAULT_PATCH_TAB}?${PatchTasksQueryParams.Variant}=${buildVariant}`;

export const getUserPatchesRoute = (userId: string): string =>
  `${paths.user}/${userId}/${PageNames.Patches}`;

export const getVersionRoute = (versionId: string, tab?: PatchTab) =>
  `${paths.version}/${versionId}/${tab ?? DEFAULT_PATCH_TAB}`;

export const getHostRoute = (hostId: string) => `${paths.host}/${hostId}`;

export const getTaskRoute = (taskId: string) => `${paths.task}/${taskId}`;
