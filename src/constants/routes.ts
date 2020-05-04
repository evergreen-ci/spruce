export const paths = {
  login: "/login",
  myPatches: "/my-patches",
  task: "/task",
  patch: "/patch",
  commitQueue: "/commit-queue",
};

export const routes = {
  login: paths.login,
  myPatches: paths.myPatches,
  task: `${paths.task}/:id/:tab?`,
  patch: `${paths.patch}/:id/:tab?`,
  commitQueue: `${paths.commitQueue}/:id`,
  configurePatch: `${paths.patch}/:id/configure/:tab?`,
};

export enum PatchTab {
  Tasks = "tasks",
  Changes = "changes",
}

export const DEFAULT_PATCH_TAB = PatchTab.Tasks;
