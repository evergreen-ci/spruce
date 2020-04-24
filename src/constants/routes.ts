export const paths = {
  login: "/login",
  myPatches: "/my-patches",
  task: "/task",
  patch: "/patch",
};

export const routes = {
  login: paths.login,
  myPatches: paths.myPatches,
  task: `${paths.task}/:id/:tab?`,
  patch: `${paths.patch}/:id/:tab?`,
  configurePatch: `${paths.patch}/:id/configure/:tab?`,
};
