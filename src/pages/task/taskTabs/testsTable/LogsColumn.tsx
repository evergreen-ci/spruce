import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Link } from "react-router-dom";
import { Analytics } from "analytics/task/useTaskAnalytics";
import { getTaskHistoryRoute } from "constants/routes";
import { size } from "constants/tokens";
import { TestResult, GetTaskQuery } from "gql/generated/types";
import { TestStatus } from "types/test";
import { string } from "utils";

const { escapeRegex } = string;
interface Props {
  onClick: Analytics["sendEvent"];
  testResult: TestResult;
  task: GetTaskQuery["task"];
}

export const LogsColumn: React.VFC<Props> = ({ testResult, onClick, task }) => {
  const { status, testFile } = testResult;
  const { url: urlHTML, urlRaw, urlParsley } = testResult.logs ?? {};
  const { project, displayName, displayTask, order } = task ?? {};
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
            onClick({
              name: "Click Test Logs Button",
              logViewer: "parsley",
              testStatus: status,
            })
          }
        >
          Parsley
        </Button>
      )}
      {urlHTML && (
        <Button
          data-cy="test-table-html-btn"
          size="xsmall"
          target="_blank"
          href={urlHTML}
          onClick={() =>
            onClick({
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
            onClick({
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
            onClick({ name: "Click See History Button" });
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
