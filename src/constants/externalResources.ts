import { getUiUrl } from "utils/getEnvironmentVariables";

export const cliDocumentationUrl =
  "https://github.com/evergreen-ci/evergreen/wiki/Using-the-Command-Line-Tool";

export const legacyRoutes = {
  distros: "/distros",
  hosts: "/spawn",
  projects: "/projects",
};

export const getIdeUrl = (hostId: string) => `${getUiUrl()}/host/${hostId}/ide`;
