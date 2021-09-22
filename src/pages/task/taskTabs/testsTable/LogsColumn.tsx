import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Analytics } from "analytics/addPageAction";
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
  const { url: urlHTML, urlRaw, urlLobster } = testResult.logs ?? {};
  return (
    <>
      {urlLobster && (
        <ButtonWrapper>
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
        </ButtonWrapper>
      )}
      {urlHTML && (
        <ButtonWrapper>
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
        </ButtonWrapper>
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
    </>
  );
};

const ButtonWrapper = styled("span")`
  margin-right: 8px;
`;
