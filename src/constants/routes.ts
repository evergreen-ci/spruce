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
}

export const getBuildStatusIconLink = (patchId: string, buildVariant: string) =>
  `${paths.version}/${patchId}/${DEFAULT_PATCH_TAB}?${PatchTasksQueryParams.Variant}=${buildVariant}`;

export const getUserPatchesRoute = (userId: string): string =>
  `${paths.user}/${userId}/${PageNames.Patches}`;
