import { LogTypes } from "types/task";
import { getLobsterURL, getUiUrl } from "utils/getEnvironmentVariables";

export const cliDocumentationUrl =
  "https://github.com/evergreen-ci/evergreen/wiki/Using-the-Command-Line-Tool";

export const windowsPasswordRulesURL =
  "https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc786468(v=ws.10)?redirectedfrom=MSDN";

export const legacyRoutes = {
  distros: "/distros",
  hosts: "/spawn",
  projects: "/projects",
};

export const getIdeUrl = (hostId: string) => `${getUiUrl()}/host/${hostId}/ide`;

export const getJiraSearchUrl = (jiraHost: string, jqlEscaped: string) =>
  `https://${jiraHost}/secure/IssueNavigator.jspa?jql=${jqlEscaped}`;

export const getJiraTicketUrl = (jiraHost: string, jiraKey: string) =>
  `https://${jiraHost}/browse/${jiraKey}`;

export const getLobsterTaskLink = (
  logType: LogTypes,
  taskId: string,
  execution: number
) =>
  `${getLobsterURL()}/lobster/evergreen/task/${taskId}/${execution}/${logType}`;
