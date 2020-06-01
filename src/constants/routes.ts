export const paths = {
  login: "/login",
  myPatches: "/my-patches",
  task: "/task",
  patch: "/patch",
  commitQueue: "/commit-queue",
  preferences: "/preferences",
};

export const routes = {
  login: paths.login,
  myPatches: paths.myPatches,
  task: `${paths.task}/:id/:tab?`,
  patch: `${paths.patch}/:id/:tab?`,
  commitQueue: `${paths.commitQueue}/:id`,
  configurePatch: `${paths.patch}/:id/configure/:tab?`,
  preferences: `${paths.preferences}/:tab?`,
};

export enum PatchTab {
  Tasks = "tasks",
  Changes = "changes",
}

export enum preferencesTabRoutes {
  Profile = "profile",
  Notifications = "notifications",
  CLI = "cli",
}

export const DEFAULT_PATCH_TAB = PatchTab.Tasks;
