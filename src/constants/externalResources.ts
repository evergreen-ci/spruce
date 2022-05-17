import { LogTypes } from "types/task";
import { environmentalVariables } from "utils";

const { getLobsterURL, getUiUrl } = environmentalVariables;

export const wikiUrl = "https://github.com/evergreen-ci/evergreen/wiki";

export const versionControlDocumentationUrl = `${wikiUrl}/Project-and-Distro-Settings#version-control`;

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

export const getGithubCommitUrl = (
  owner: string,
  repo: string,
  githash: string
) => `https://github.com/${owner}/${repo}/commit/${githash}`;

export const getLobsterTaskLink = (
  logType: LogTypes,
  taskId: string,
  execution: number
) =>
  `${getLobsterURL()}/lobster/evergreen/task/${taskId}/${execution}/${logType}`;

interface GetLobsterTestLogCompleteUrlParams {
  taskId: string;
  execution: number;
  groupId?: string;
  lineNum?: number;
}

export const getLobsterTestLogCompleteUrl = ({
  taskId,
  execution,
  groupId,
  lineNum,
}: GetLobsterTestLogCompleteUrlParams) =>
  taskId && Number.isFinite(execution)
    ? `${getLobsterURL()}/lobster/evergreen/complete-test/${taskId}/${execution}${
        groupId ? `/${groupId}` : ""
      }${lineNum ? `#shareLine=${lineNum}` : ""}`
    : "";
