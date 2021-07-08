import { LogTypes } from "types/task";
import { environmentalVariables } from "utils";

const { getLobsterURL, getUiUrl } = environmentalVariables;

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

export const getGithubPullRequestUrl = (
  owner: string,
  repo: string,
  issue: number | string
) => `https://github.com/${owner}/${repo}/pull/${issue}`;

export const getLobsterTaskLink = (
  logType: LogTypes,
  taskId: string,
  execution: number
) =>
  `${getLobsterURL()}/lobster/evergreen/task/${taskId}/${execution}/${logType}`;

const deprecatedLogkeeperLobsterURL = "https://logkeeper.mongodb.org";

export const getUpdatedLobsterUrl = (link: string) =>
  link.replace(deprecatedLogkeeperLobsterURL, `${getLobsterURL()}/lobster`);

interface GetLobsterTestLogUrlParams {
  taskId: string;
  execution: number;
  testId: string;
  lineNum?: number;
}

export const getLobsterTestLogUrl = ({
  taskId,
  execution,
  testId,
  lineNum,
}: GetLobsterTestLogUrlParams) =>
  !taskId || Number.isNaN(execution) || !testId
    ? ""
    : `${getLobsterURL()}/lobster/evergreen/test/${taskId}/${execution}/${testId}${
        lineNum ? `#shareLine=${lineNum}` : ""
      }`;

export const isLogkeeperLink = (link: string) =>
  link.includes(`${deprecatedLogkeeperLobsterURL}/build`);
