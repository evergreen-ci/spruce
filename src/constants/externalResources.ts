import { getUnixTime } from "date-fns";
import { LogTypes } from "types/task";
import { environmentVariables } from "utils";

const { getHoneycombBaseURL, getLobsterURL, getParsleyUrl, getUiUrl } =
  environmentVariables;

export const wikiBaseUrl =
  "https://docs.devprod.prod.corp.mongodb.com/evergreen";

export const wikiUrl = `${wikiBaseUrl}/Home`;

export const projectDistroSettingsDocumentationUrl = `${wikiBaseUrl}/Project-Configuration/Project-and-Distro-Settings`;

export const versionControlDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#version-control`;

export const patchAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#patch-aliases`;

export const pullRequestAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#pr-aliases`;

export const commitQueueAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#commit-queue-aliases`;

export const gitTagAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#git-tag-aliases`;

export const githubChecksAliasesDocumentationUrl = `${projectDistroSettingsDocumentationUrl}#github-checks-aliases`;

export const githubMergeQueueDocumentationUrl = `${wikiBaseUrl}/Project-Configuration/Merge-Queue`;

export const ignoredFilesDocumentationUrl = `${wikiBaseUrl}/Project-Configuration/Project-Configuration-Files#ignoring-changes-to-certain-files`;

export const cliDocumentationUrl = `${wikiBaseUrl}/CLI`;

export const windowsPasswordRulesURL =
  "https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc786468(v=ws.10)?redirectedfrom=MSDN";

export const getJiraBugUrl = (jiraHost: string) =>
  `https://${jiraHost}/secure/CreateIssueDetails!init.jspa?pid=22786&issuetype=1&priority=4&labels=user-feedback&description=Please%20note%20browser%20and%20OS%20when%20describing%20your%20issue.`;

export const getJiraImprovementUrl = (jiraHost: string) =>
  `https://${jiraHost}/secure/CreateIssueDetails!init.jspa?pid=22786&issuetype=4&priority=4&labels=user-feedback`;

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
  issue: number | string,
) => `https://github.com/${owner}/${repo}/pull/${issue}`;

export const getGithubCommitUrl = (
  owner: string,
  repo: string,
  githash: string,
) => `https://github.com/${owner}/${repo}/commit/${githash}`;

export const getParsleyTaskLogLink = (
  logType: LogTypes,
  taskId: string,
  execution: number,
) => `${getParsleyUrl()}/evergreen/${taskId}/${execution}/${logType}`;

interface GetLobsterTestLogCompleteUrlParams {
  taskId: string;
  execution: number;
  groupId?: string;
  lineNum?: number;
}

export const getLobsterTestLogCompleteUrl = ({
  execution,
  groupId,
  lineNum,
  taskId,
}: GetLobsterTestLogCompleteUrlParams) =>
  taskId && Number.isFinite(execution)
    ? `${getLobsterURL()}/lobster/evergreen/complete-test/${taskId}/${execution}${
        groupId ? `/${groupId}` : ""
      }${lineNum ? `#shareLine=${lineNum}` : ""}`
    : "";

export const getLobsterTaskLink = (
  logType: LogTypes,
  taskId: string,
  execution: number,
) =>
  `${getLobsterURL()}/lobster/evergreen/task/${taskId}/${execution}/${logType}`;

export const getParsleyTestLogURL = (buildId: string, testId: string) =>
  `${getParsleyUrl()}/resmoke/${buildId}/test/${testId}`;

export const getParsleyBuildLogURL = (buildId: string) =>
  `${getParsleyUrl()}/resmoke/${buildId}/all`;

export const getHoneycombTraceUrl = (
  traceId: string,
  startTs: Date,
  endTs: Date,
) =>
  `${getHoneycombBaseURL()}/datasets/evergreen-agent/trace?trace_id=${traceId}&trace_start_ts=${getUnixTime(
    new Date(startTs),
  )}&trace_end_ts=${getUnixTime(new Date(endTs))}`;

export const getHoneycombSystemMetricsUrl = (
  taskId: string,
  diskDevices: string[],
  startTs: Date,
  endTs: Date,
): string => {
  const query = {
    calculations: [
      { op: "AVG", column: "system.memory.usage.used" },
      { op: "AVG", column: "system.cpu.utilization" },
      { op: "RATE_AVG", column: "system.network.io.transmit" },
      { op: "RATE_AVG", column: "system.network.io.receive" },
    ].concat(
      diskDevices.flatMap((device) => [
        { op: "RATE_AVG", column: `system.disk.io.${device}.read` },
        { op: "RATE_AVG", column: `system.disk.io.${device}.write` },
        { op: "RATE_AVG", column: `system.disk.operations.${device}.read` },
        {
          op: "RATE_AVG",
          column: `system.disk.operations.${device}.write`,
        },
        { op: "RATE_AVG", column: `system.disk.io_time.${device}` },
      ]),
    ),
    filters: [{ op: "=", column: "evergreen.task.id", value: taskId }],
    start_time: getUnixTime(new Date(startTs)),
    end_time: getUnixTime(new Date(endTs)),
  };

  return `${getHoneycombBaseURL()}/datasets/evergreen?query=${JSON.stringify(
    query,
  )}&omitMissingValues`;
};

export const adminSettingsURL = `${getUiUrl()}/admin`;
