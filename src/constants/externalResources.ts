import { LogTypes } from "types/task";
import { environmentalVariables } from "utils";

const { getLobsterURL, getParsleyUrl, getUiUrl } = environmentalVariables;

const wikiBaseUrl = "https://docs.devprod.prod.corp.mongodb.com/evergreen";

const wikiUrl = `${wikiBaseUrl}/Home`;

const projectDistroSettingsDocumentationUrl = `${wikiBaseUrl}/Test%20with%20Evergreen/Configure%20a%20Project/Project-and-Distro-Settings`;

const versionControlDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#version-control`;

const patchAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#patch-aliases`;

const pullRequestAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#pr-aliases`;

const commitQueueAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#commit-queue-aliases`;

const gitTagAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#git-tag-aliases`;

const githubChecksAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#github-checks-aliases`;

const cliDocumentationUrl = `${wikiBaseUrl}/Test%20with%20Evergreen/Using-the-Command-Line-Tool`;

const windowsPasswordRulesURL =
  "https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc786468(v=ws.10)?redirectedfrom=MSDN";

const konamiSoundTrackUrl =
  "https://www.myinstants.com/media/sounds/mvssf-win.mp3";

const legacyRoutes = {
  distros: "/distros",
  hosts: "/spawn",
  projects: "/projects",
};

const getIdeUrl = (hostId: string) => `${getUiUrl()}/host/${hostId}/ide`;

const getJiraSearchUrl = (jiraHost: string, jqlEscaped: string) =>
  `https://${jiraHost}/secure/IssueNavigator.jspa?jql=${jqlEscaped}`;

const getJiraTicketUrl = (jiraHost: string, jiraKey: string) =>
  `https://${jiraHost}/browse/${jiraKey}`;

const getGithubPullRequestUrl = (
  owner: string,
  repo: string,
  issue: number | string
) => `https://github.com/${owner}/${repo}/pull/${issue}`;

const getGithubCommitUrl = (owner: string, repo: string, githash: string) =>
  `https://github.com/${owner}/${repo}/commit/${githash}`;

const getParsleyTaskLogLink = (
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

const getLobsterTestLogCompleteUrl = ({
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

const getLobsterTaskLink = (
  logType: LogTypes,
  taskId: string,
  execution: number
) =>
  `${getLobsterURL()}/lobster/evergreen/task/${taskId}/${execution}/${logType}`;

const getParsleyTestLogURL = (buildId: string, testId: string) =>
  `${getParsleyUrl()}/resmoke/${buildId}/test/${testId}`;

const getParsleyBuildLogURL = (buildId: string) =>
  `${getParsleyUrl()}/resmoke/${buildId}/all`;

export {
  wikiUrl,
  projectDistroSettingsDocumentationUrl,
  versionControlDocumentationUrl,
  patchAliasesDocumentationUrl,
  pullRequestAliasesDocumentationUrl,
  commitQueueAliasesDocumentationUrl,
  gitTagAliasesDocumentationUrl,
  githubChecksAliasesDocumentationUrl,
  cliDocumentationUrl,
  windowsPasswordRulesURL,
  konamiSoundTrackUrl,
  legacyRoutes,
  getIdeUrl,
  getJiraSearchUrl,
  getJiraTicketUrl,
  getGithubPullRequestUrl,
  getGithubCommitUrl,
  getParsleyTaskLogLink,
  getLobsterTestLogCompleteUrl,
  getLobsterTaskLink,
  getParsleyTestLogURL,
  getParsleyBuildLogURL,
};
