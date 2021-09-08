import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Analytics } from "analytics/addPageAction";
import {
  getLobsterTestLogUrl,
  getUpdatedLobsterUrl,
  isLogkeeperLink,
} from "constants/externalResources";
import { TestResult } from "gql/generated/types";

interface Props {
  taskAnalytics: Analytics<
    | { name: "Click Logs Lobster Button" }
    | { name: "Click Logs HTML Button" }
    | { name: "Click Logs Raw Button" }
  >;
  testResult: TestResult;
}

export const LogsColumn: React.FC<Props> = ({ testResult, taskAnalytics }) => {
  const { execution, lineNum, taskId, id } = testResult || {};
  const { htmlDisplayURL, rawDisplayURL } = testResult?.logs ?? {};
  const hasLobsterLink = isLogkeeperLink(htmlDisplayURL);
  const lobsterLink = hasLobsterLink
    ? getUpdatedLobsterUrl(htmlDisplayURL)
    : getLobsterTestLogUrl({ taskId, execution, testId: id, lineNum });

  return (
    <>
      {lobsterLink && (
        <ButtonWrapper>
          <Button
            data-cy="test-table-lobster-btn"
            size="small"
            target="_blank"
            variant="default"
            href={lobsterLink}
            onClick={() =>
              taskAnalytics.sendEvent({
                name: "Click Logs Lobster Button",
              })
            }
          >
            Lobster
          </Button>
        </ButtonWrapper>
      )}
      {!hasLobsterLink && (
        <ButtonWrapper>
          <Button
            data-cy="test-table-html-btn"
            size="small"
            target="_blank"
            variant="default"
            href={htmlDisplayURL}
            onClick={() =>
              taskAnalytics.sendEvent({
                name: "Click Logs HTML Button",
              })
            }
          >
            HTML
          </Button>
        </ButtonWrapper>
      )}
      {rawDisplayURL && (
        <Button
          data-cy="test-table-raw-btn"
          size="small"
          target="_blank"
          variant="default"
          href={rawDisplayURL}
          onClick={() =>
            taskAnalytics.sendEvent({ name: "Click Logs Raw Button" })
          }
        >
          Raw
        </Button>
      )}
    </>
  );
};

const ButtonWrapper = styled("span")`
  margin-right: 8px;
`;
