import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Analytics } from "analytics/addPageAction";
import { getTaskHistoryRoute } from "constants/routes";
import { size } from "constants/tokens";
import { TestResult, GetTaskQuery } from "gql/generated/types";
import { TestStatus } from "types/test";
import { string } from "utils";
import {
  getLobsterURL,
  getParsleyUrl,
  isProduction,
} from "utils/environmentalVariables";
import { stringifyQuery } from "utils/queryString";

const { escapeRegex } = string;
interface Props {
  taskAnalytics: Analytics<
    | { name: "Click Logs Lobster Button" }
    | { name: "Click Logs HTML Button" }
    | { name: "Click Logs Raw Button" }
    | { name: "Click See History Button" }
  >;
  testResult: TestResult;
  task: GetTaskQuery["task"];
}

// These are temporary until we update the backend to return the correct links
const turnTestLogLinkIntoParsleyLink = (url: string) => {
  const legacyLobsterURL = `${getLobsterURL()}/lobster/evergreen/test`;
  const parsleyTestURL = `${getParsleyUrl()}/test`;
  let newURL = url.replace(legacyLobsterURL, parsleyTestURL);
  const selectedLineRegexp = /#shareLine=([0-9]+)/;
  const selectedLine = url.match(selectedLineRegexp)?.[1];
  newURL = newURL.replace(selectedLineRegexp, "");

  return `${newURL}?${stringifyQuery({ selectedLine })}`;
};

const turnResmokeTestLogLinkIntoParsleyLink = (url: string) => {
  const legacyResmokeLobsterURL = `${getLobsterURL()}/lobster/build`;
  const parsleyResmokeTestURL = `${getParsleyUrl()}/resmoke`;
  let newURL = url.replace(legacyResmokeLobsterURL, parsleyResmokeTestURL);
  const selectedLineRegexp = /#shareLine=([0-9]+)/;
  const selectedLine = url.match(selectedLineRegexp)?.[1];
  newURL = newURL.replace(selectedLineRegexp, "");

  return `${newURL}?${stringifyQuery({ selectedLine })}`;
};

export const LogsColumn: React.VFC<Props> = ({
  testResult,
  taskAnalytics,
  task,
}) => {
  const { status, testFile } = testResult;
  const { url: urlHTML, urlRaw, urlLobster } = testResult.logs ?? {};
  const { project, displayName, displayTask, order } = task ?? {};
  const parsleyLink = urlLobster
    ? turnTestLogLinkIntoParsleyLink(urlLobster)
    : turnResmokeTestLogLinkIntoParsleyLink(urlHTML);
  const filters =
    status === TestStatus.Fail
      ? {
          failingTests: [escapeRegex(testFile)],
        }
      : null;

  const isExecutionTask = displayTask !== null;
  return (
    <ButtonWrapper>
      {urlLobster && (
        <Button
          data-cy="test-table-lobster-btn"
          size="xsmall"
          target="_blank"
          href={isProduction() ? urlLobster : parsleyLink}
          onClick={() =>
            taskAnalytics.sendEvent({
              name: "Click Logs Lobster Button",
            })
          }
        >
          Lobster
        </Button>
      )}
      {urlHTML && (
        <Button
          data-cy="test-table-html-btn"
          size="xsmall"
          target="_blank"
          href={isProduction() || urlLobster ? urlHTML : parsleyLink}
          onClick={() =>
            taskAnalytics.sendEvent({
              name: "Click Logs HTML Button",
            })
          }
        >
          HTML
        </Button>
      )}
      {urlRaw && (
        <Button
          data-cy="test-table-raw-btn"
          size="xsmall"
          target="_blank"
          href={urlRaw}
          onClick={() =>
            taskAnalytics.sendEvent({ name: "Click Logs Raw Button" })
          }
        >
          Raw
        </Button>
      )}
      {filters && !isExecutionTask && (
        <Button
          size="xsmall"
          data-cy="task-history-tests-btn"
          key="task-history"
          onClick={() => {
            taskAnalytics.sendEvent({ name: "Click See History Button" });
          }}
          href={getTaskHistoryRoute(project?.identifier, displayName, {
            filters,
            selectedCommit: order,
          })}
        >
          History
        </Button>
      )}
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.div`
  > * {
    margin-right: ${size.xs};
    margin-top: ${size.xs};
  }
`;
