import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { uiColors } from "@leafygreen-ui/palette";
import { Table, TableHeader, Row, Cell } from "@leafygreen-ui/table";
import { useLocation } from "react-router-dom";
import { useJobLogsAnalytics } from "analytics/joblogs/useJobLogsAnalytics";
import PageSizeSelector, {
  usePageSizeSelector,
} from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { TablePlaceholder } from "components/Table/TablePlaceholder";
import { TableSearchPopover } from "components/TablePopover";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  GetDisplayTaskQuery,
  GetTestsQuery,
  GetTestsQueryVariables,
} from "gql/generated/types";
import { GET_TESTS } from "gql/queries";
import { useFilterInputChangeHandler } from "hooks";
import { queryString, url } from "utils";

const { parseQueryString, getString } = queryString;
const { getPageFromSearch, getLimitFromSearch } = url;
const { gray } = uiColors;

enum JobLogsQueryParams {
  Category = "sortBy",
  SortDir = "sortDir",
  Page = "page",
  Limit = "limit",
  Test = "test",
}

interface JobLogsTableProps {
  task: GetDisplayTaskQuery["task"]["displayTask"];
  groupId?: string;
}

export const JobLogsTable: React.VFC<JobLogsTableProps> = ({
  task,
  groupId,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useJobLogsAnalytics();
  const { search } = useLocation();

  const queryVariables = getQueryVariables(search, task, groupId);
  const { limitNum, pageNum } = queryVariables;
  const setPageSize = usePageSizeSelector();
  const testNameFilter = useFilterInputChangeHandler({
    urlParam: "test",
    resetPage: true,
    sendAnalyticsEvent: (filterBy: string) =>
      sendEvent({ name: "Filter Job Logs", filterBy }),
  });

  const { data: testData, loading: isLoadingTests } = useQuery<
    GetTestsQuery,
    GetTestsQueryVariables
  >(GET_TESTS, {
    variables: queryVariables,
    fetchPolicy: "cache-first",
    onError: (err) =>
      dispatchToast.error(
        `There was an error loading test result data: ${err.message}`
      ),
  });
  const { testResults, filteredTestCount } = testData?.taskTests ?? {};
  const numPages = Math.ceil(filteredTestCount / limitNum) || 0;

  return (
    <Container>
      <PaginationWrapper>
        <PageSizeSelector value={limitNum} onChange={setPageSize} />
        <Pagination value={pageNum} numPages={numPages} useLeafygreen />
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
                  <TableSearchPopover
                    placeholder="Test name regex"
                    value={testNameFilter.inputValue}
                    onChange={testNameFilter.setInputValue}
                    onConfirm={testNameFilter.submitInputValue}
                    data-cy="test-filter-popover"
                  />
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
      {!isLoadingTests && testResults.length === 0 && (
        <TablePlaceholder message="No test results found." />
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
  > :first-of-type {
    margin-right: ${size.s};
  }
`;
const TableWrapper = styled.div`
  border-top: 3px solid ${gray.light2};
  th:first-of-type {
    width: 80%;
    padding-right: ${size.xl};
  }
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
  > :first-of-type {
    margin-right: ${size.xs};
  }
`;
