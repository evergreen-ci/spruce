import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Link } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { getTaskHistoryRoute } from "constants/routes";
import { size } from "constants/tokens";
import { TestResult, GetTaskQuery } from "gql/generated/types";
import { TestStatus } from "types/test";
import { string } from "utils";

const { escapeRegex } = string;
interface Props {
  testResult: TestResult;
  task: GetTaskQuery["task"];
}

export const LogsColumn: React.VFC<Props> = ({ testResult, task }) => {
  const { status, testFile } = testResult;
  const {
    url: urlHTML,
    urlRaw,
    urlParsley,
    urlLobster,
  } = testResult.logs ?? {};
  const { project, displayName, displayTask, order } = task ?? {};
  const { sendEvent } = useTaskAnalytics();
  const filters =
    status === TestStatus.Fail
      ? {
          failingTests: [escapeRegex(testFile)],
        }
      : null;

  const isExecutionTask = displayTask !== null;
  return (
    <ButtonWrapper>
      {urlParsley && (
        <Button
          data-cy="test-table-parsley-btn"
          size="xsmall"
          target="_blank"
          href={urlParsley}
          onClick={() =>
            sendEvent({
              name: "Click Test Logs Button",
              logViewer: "parsley",
              testStatus: status,
            })
          }
        >
          Parsley
        </Button>
      )}
      {urlLobster && (
        <Button
          data-cy="test-table-lobster-btn"
          size="xsmall"
          target="_blank"
          href={urlLobster}
          onClick={() =>
            sendEvent({
              name: "Click Test Logs Button",
              logViewer: "lobster",
              testStatus: status,
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
          href={urlHTML}
          onClick={() =>
            sendEvent({
              name: "Click Test Logs Button",
              logViewer: "html",
              testStatus: status,
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
            sendEvent({
              name: "Click Test Logs Button",
              logViewer: "raw",
              testStatus: status,
            })
          }
        >
          Raw
        </Button>
      )}
      {filters && !isExecutionTask && (
        <Button
          size="xsmall"
          as={Link}
          data-cy="task-history-tests-btn"
          key="task-history"
          onClick={() => {
            sendEvent({ name: "Click See History Button" });
          }}
          to={getTaskHistoryRoute(project?.identifier, displayName, {
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
