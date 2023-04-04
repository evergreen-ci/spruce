import { LogTypes } from "types/task";
import { environmentalVariables } from "utils";

const { getLobsterURL, getParsleyUrl, getUiUrl } = environmentalVariables;

export const wikiUrl = "https://docs.devprod.prod.corp.mongodb.com/evergreen";

export const konamiSoundTrackUrl =
  "https://www.myinstants.com/media/sounds/mvssf-win.mp3";

export const projectDistroSettingsDocumentationUrl = `${wikiUrl}/Project-and-Distro-Settings`;

export const versionControlDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#version-control`;

export const patchAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#patch-aliases`;

export const pullRequestAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#pr-aliases`;

export const commitQueueAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#commit-queue-aliases`;

export const gitTagAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#git-tag-aliases`;

export const githubChecksAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#github-checks-aliases`;

export const cliDocumentationUrl =
  "https://docs.devprod.prod.corp.mongodb.com/evergreen/Using-the-Command-Line-Tool";

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

export const getParsleyTaskLogLink = (
  logType: LogTypes,
  taskId: string,
  execution: number
) => `${getParsleyUrl()}/evergreen/${taskId}/${execution}/${logType}`;

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

export const getLobsterTaskLink = (
  logType: LogTypes,
  taskId: string,
  execution: number
) =>
  `${getLobsterURL()}/lobster/evergreen/task/${taskId}/${execution}/${logType}`;

export const getParsleyTestLogURL = (buildId: string, testId: string) =>
  `${getParsleyUrl()}/resmoke/${buildId}/test/${testId}`;

export const getParsleyBuildLogURL = (buildId: string) =>
  `${getParsleyUrl()}/resmoke/${buildId}/all`;
