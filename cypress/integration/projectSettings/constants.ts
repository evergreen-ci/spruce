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

export const getContainersRoute = (identifier: string) =>
  `${getSettingsRoute(identifier)}/containers`;

export const getViewsAndFiltersRoute = (identifier: string) =>
  `${getSettingsRoute(identifier)}/views-and-filters`;

export const getVirtualWorkstationRoute = (identifier: string) =>
  `${getSettingsRoute(identifier)}/virtual-workstation`;

export const project = "spruce";
export const projectUseRepoEnabled = "evergreen";
export const repo = "602d70a2b2373672ee493184";

/**
 * `saveButtonEnabled` checks if the save button is enabled or disabled.
 * @param isEnabled - if true, the save button should be enabled. If false, the save button should be disabled.
 */
export const saveButtonEnabled = (isEnabled: boolean = true) => {
  cy.dataCy("save-settings-button").should(
    isEnabled ? "not.have.attr" : "have.attr",
    "aria-disabled",
    "true",
  );
};
