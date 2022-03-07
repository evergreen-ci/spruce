import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import { Table, TableHeader, Row, Cell } from "@leafygreen-ui/table";
import { useLocation } from "react-router-dom";
import { useJobLogsAnalytics } from "analytics/joblogs/useJobLogsAnalytics";
import { Button } from "components/Button";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  GetDisplayTaskQuery,
  GetTestsQuery,
  GetTestsQueryVariables,
} from "gql/generated/types";
import { GET_TESTS } from "gql/queries";
import { JobLogsPopover } from "pages/jobLogs/JobLogsPopover";
import { PageSizeSelect } from "pages/jobLogs/PageSizeSelect";
import { PaginationButtons } from "pages/jobLogs/PaginationButtons";

import { queryString, url } from "utils";

const { parseQueryString, getString } = queryString;
const { getPageFromSearch, getLimitFromSearch } = url;
const { gray } = uiColors;

enum JobLogsQueryParams {
  Category = "sortBy",
  SortDir = "sortDir",
  Sorts = "sorts",
  Page = "page",
  Limit = "limit",
  Test = "test",
}

interface JobLogsTableProps {
  task: GetDisplayTaskQuery["task"]["displayTask"];
  groupId?: string;
}

export const JobLogsTable: React.FC<JobLogsTableProps> = ({
  task,
  groupId,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useJobLogsAnalytics();

  const [numPages, setNumPages] = useState(0);
  const { search } = useLocation();
  const queryVariables = getQueryVariables(search, task, groupId);
  const { limitNum, pageNum } = queryVariables;

  const { data: testData, loading: isLoadingTests } = useQuery<
    GetTestsQuery,
    GetTestsQueryVariables
  >(GET_TESTS, {
    variables: queryVariables,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      const { filteredTestCount } = data.taskTests ?? {};
      const newNumPages = Math.ceil(filteredTestCount / limitNum);
      if (newNumPages !== numPages) setNumPages(newNumPages);
    },
    onError: (err) =>
      dispatchToast.error(
        `There was an error loading test result data: ${err.message}`
      ),
  });
  const { testResults } = testData?.taskTests ?? {};

  return (
    <Container>
      <PaginationWrapper>
        <PageSizeSelect limitNum={limitNum} />
        <PaginationButtons currentPage={pageNum} pageCount={numPages} />
      </PaginationWrapper>
      <TableWrapper>
        <Table
          data={testResults}
          columns={[
            <TableHeader
              key="test-name"
              label={
                <LabelWrapper>
                  Test Name
                  <JobLogsPopover data-cy="test-filter-popover" />
                </LabelWrapper>
              }
            />,
            <TableHeader key="log-links" label="Log Links" />,
          ]}
        >
          {({ datum }) => (
            <StyledRow key={datum?.id} data-cy="job-logs-table-row">
              <Cell>{datum?.testFile}</Cell>
              <Cell>
                <ButtonWrapper>
                  <ButtonSpacer>
                    <Button
                      disabled={!datum?.logs?.urlLobster}
                      href={datum?.logs?.urlLobster}
                      target="_blank"
                      onClick={() =>
                        sendEvent({
                          name: "Clicked lobster testlog url",
                          testId: datum?.id,
                        })
                      }
                      size="xsmall"
                    >
                      Lobster
                    </Button>
                  </ButtonSpacer>
                  <Button
                    disabled={!datum?.logs?.url}
                    href={datum?.logs?.url}
                    target="_blank"
                    onClick={() =>
                      sendEvent({
                        name: "Clicked HTML testlog url",
                        testId: datum?.id,
                      })
                    }
                    size="xsmall"
                  >
                    HTML
                  </Button>
                </ButtonWrapper>
              </Cell>
            </StyledRow>
          )}
        </Table>
      </TableWrapper>
      {isLoadingTests && !testResults && (
        <NoTestResults>
          <SpinningIcon glyph="Refresh" size="large" />
          <Message> Loading...</Message>
        </NoTestResults>
      )}
      {!isLoadingTests && testResults.length === 0 && (
        <NoTestResults>
          <Icon glyph="CurlyBraces" size="large" />
          <Message> No test results found.</Message>
        </NoTestResults>
      )}
    </Container>
  );
};

const getQueryVariables = (
  search: string,
  task: GetDisplayTaskQuery["task"]["displayTask"],
  groupId?: string
) => {
  const { [JobLogsQueryParams.Test]: test } = parseQueryString(search);
  return {
    testName: getString(test),
    pageNum: getPageFromSearch(search),
    limitNum: getLimitFromSearch(search),
    taskId: task.id,
    execution: task.execution,
    ...(groupId && { groupId }),
  };
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: ${size.s};
`;
const TableWrapper = styled.div`
  border-top: 3px solid ${gray.light2};
`;
const StyledRow = styled(Row)`
  td:first-of-type {
    width: 80%;
    word-break: break-all;
    padding-right: ${size.xl};
  }
`;
const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const ButtonWrapper = styled.div`
  display: flex;
`;
const ButtonSpacer = styled.div`
  margin-right: ${size.s};
`;
const NoTestResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${size.l} 0;
  background-color: ${gray.light2};
  opacity: 50%;
`;
const SpinningIcon = styled(Icon)`
  animation: spin infinite 2s linear;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
const Message = styled.div`
  margin-top: ${size.xs};
`;
