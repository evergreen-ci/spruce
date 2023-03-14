const getSettingsRoute = (identifier: string) =>
  `project/${identifier}/settings`;

export const getGeneralRoute = (identifier: string) =>
  `${getSettingsRoute(identifier)}/general`;

export const getGithubCommitQueueRoute = (identifier: string) =>
  `${getSettingsRoute(identifier)}/github-commitqueue`;

export const getNotificationsRoute = (identifier: string) =>
  `${getSettingsRoute(identifier)}/notifications`;

export const getAccessRoute = (identifier: string) =>
  `${getSettingsRoute(identifier)}/access`;

export const getPluginsRoute = (identifier: string) =>
  `${getSettingsRoute(identifier)}/plugins`;

export const project = "spruce";
export const projectUseRepoEnabled = "evergreen";
export const repo = "602d70a2b2373672ee493184";
