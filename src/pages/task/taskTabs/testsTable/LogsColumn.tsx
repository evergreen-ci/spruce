import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Link } from "react-router-dom";
import { Analytics } from "analytics/addPageAction";
import { getTaskHistoryRoute } from "constants/routes";
import { size } from "constants/tokens";
import { TestResult, GetTaskForTestsTableQuery } from "gql/generated/types";
import { TestStatus } from "types/test";
import { string } from "utils";
import { isBeta } from "utils/environmentalVariables";

const { escapeRegex } = string;
interface Props {
  taskAnalytics: Analytics<
    | { name: "Click Logs Lobster Button" }
    | { name: "Click Logs HTML Button" }
    | { name: "Click Logs Raw Button" }
    | { name: "Click See History Button" }
  >;
  testResult: TestResult;
  task: GetTaskForTestsTableQuery["task"];
}

export const LogsColumn: React.FC<Props> = ({
  testResult,
  taskAnalytics,
  task,
}) => {
  const { status, testFile } = testResult;
  const { url: urlHTML, urlRaw, urlLobster } = testResult.logs ?? {};
  const { projectIdentifier, displayName, displayTask, order } = task ?? {};

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
          variant="default"
          href={urlLobster}
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
          variant="default"
          href={urlHTML}
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
          variant="default"
          href={urlRaw}
          onClick={() =>
            taskAnalytics.sendEvent({ name: "Click Logs Raw Button" })
          }
        >
          Raw
        </Button>
      )}
      {isBeta() && filters && !isExecutionTask && (
        <Button
          size="xsmall"
          as={Link}
          data-cy="task-history-tests-btn"
          key="task-history"
          onClick={() => {
            taskAnalytics.sendEvent({ name: "Click See History Button" });
          }}
          to={getTaskHistoryRoute(projectIdentifier, displayName, {
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
