import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { useTaskAnalytics } from "analytics";
import { getTaskHistoryRoute } from "constants/routes";
import { size } from "constants/tokens";
import { TestResult, TaskQuery } from "gql/generated/types";
import { TestStatus } from "types/test";
import { string } from "utils";
import { TaskHistoryTestsButton } from "./logsColumn/TaskHistoryTestsButton";

const { escapeRegex } = string;
interface Props {
  testResult: TestResult;
  task: TaskQuery["task"];
}

export const LogsColumn: React.VFC<Props> = ({ task, testResult }) => {
  const { status, testFile } = testResult;
  const {
    url: urlHTML,
    urlLobster,
    urlParsley,
    urlRaw,
  } = testResult.logs ?? {};
  const { displayName, displayTask, order, project } = task ?? {};
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
          title="High-powered log viewer"
          data-cy="test-table-parsley-btn"
          size="xsmall"
          target="_blank"
          href={urlParsley}
          onClick={() =>
            sendEvent({
              logViewer: "parsley",
              name: "Click Test Logs Button",
              testStatus: status,
            })
          }
        >
          Parsley
        </Button>
      )}
      {urlLobster && (
        <Button
          title="Legacy log viewer"
          data-cy="test-table-lobster-btn"
          size="xsmall"
          target="_blank"
          href={urlLobster}
          onClick={() =>
            sendEvent({
              logViewer: "lobster",
              name: "Click Test Logs Button",
              testStatus: status,
            })
          }
        >
          Lobster
        </Button>
      )}
      {urlHTML && (
        <Button
          title="Plain, colorized log viewer"
          data-cy="test-table-html-btn"
          size="xsmall"
          target="_blank"
          href={urlHTML}
          onClick={() =>
            sendEvent({
              logViewer: "html",
              name: "Click Test Logs Button",
              testStatus: status,
            })
          }
        >
          HTML
        </Button>
      )}
      {urlRaw && (
        <Button
          title="Plain text log viewer"
          data-cy="test-table-raw-btn"
          size="xsmall"
          target="_blank"
          href={urlRaw}
          onClick={() =>
            sendEvent({
              logViewer: "raw",
              name: "Click Test Logs Button",
              testStatus: status,
            })
          }
        >
          Raw
        </Button>
      )}
      {filters && !isExecutionTask && (
        <TaskHistoryTestsButton
          onClick={() => {
            sendEvent({ name: "Click See History Button" });
          }}
          to={getTaskHistoryRoute(project?.identifier, displayName, {
            filters,
            selectedCommit: order,
          })}
        />
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
