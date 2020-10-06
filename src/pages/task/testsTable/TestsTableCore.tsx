import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled/macro";
import Button from "@leafygreen-ui/button";
import { Table, Skeleton } from "antd";
import { ColumnProps } from "antd/es/table";
import get from "lodash/get";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import Badge, { Variant } from "components/Badge";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { ResultCountLabel } from "components/ResultCountLabel";
import {
  TableContainer,
  TableControlOuterRow,
  TableControlInnerRow,
} from "components/styles";
import { pollInterval } from "constants/index";
import {
  TaskTestsQuery,
  TaskTestsQueryVariables,
  SortDirection,
  TestSortCategory,
  TestResult,
  TaskTestResult,
} from "gql/generated/types";
import { GET_TASK_TESTS } from "gql/queries/get-task-tests";
import { useNetworkStatus } from "hooks";
import { useSetColumnDefaultSortOrder } from "hooks/useSetColumnDefaultSortOrder";
import { ExecutionAsData } from "pages/task/util/execution";
import { TestStatus, RequiredQueryParams, TableOnChange } from "types/task";
import { stringifyQuery, parseQueryString, queryParamAsNumber } from "utils";
import { msToDuration } from "utils/string";
import { getPageFromSearch, getLimitFromSearch } from "utils/url";

export interface UpdateQueryArg {
  taskTests: TaskTestResult;
}
export const TestsTableCore: React.FC = () => {
  const { id: resourceId } = useParams<{ id: string }>();
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  const queryVariables = getQueryVariables(search, resourceId);
  const { cat, dir, pageNum, limitNum } = queryVariables;
  const columns = useSetColumnDefaultSortOrder<TestResult>(
    columnsTemplate,
    cat,
    dir
  );

  // initial request for task tests
  const { data, startPolling, stopPolling } = useQuery<
    TaskTestsQuery,
    TaskTestsQueryVariables
  >(GET_TASK_TESTS, {
    variables: queryVariables,
    pollInterval,
  });
  useNetworkStatus(startPolling, stopPolling);
  let showSkeleton = true;
  if (data) {
    showSkeleton = false;
  }
  // update url query params when user event triggers change
  const tableChangeHandler: TableOnChange<TestResult> = (...[, , sorter]) => {
    const { order, columnKey } = Array.isArray(sorter) ? sorter[0] : sorter;

    const nextQueryParams = stringifyQuery({
      ...parseQueryString(search),
      [RequiredQueryParams.Category]: columnKey,
      [RequiredQueryParams.Sort]:
        order === "ascend" ? SortDirection.Asc : SortDirection.Desc,
      [RequiredQueryParams.Page]: "0",
    });
    if (nextQueryParams !== search.split("?")[1]) {
      replace(`${pathname}?${nextQueryParams}`);
    }
  };

  const taskAnalytics = useTaskAnalytics();

  const dataSource: [TestResult] = get(data, "taskTests.testResults", []);

  return (
    <>
      <TableControlOuterRow>
        <ResultCountLabel
          dataCyNumerator="filtered-test-count"
          dataCyDenominator="total-test-count"
          label="tests"
          numerator={get(data, "taskTests.filteredTestCount", "-")}
          denominator={get(data, "taskTests.totalTestCount", "-")}
        />
        <TableControlInnerRow>
          <Pagination
            pageSize={limitNum}
            value={pageNum}
            totalResults={get(data, "taskTests.filteredTestCount", 0)}
            dataTestId="tests-table-pagination"
          />
          <PageSizeSelector
            dataTestId="tests-table-page-size-selector"
            value={limitNum}
            sendAnalyticsEvent={() =>
              taskAnalytics.sendEvent({ name: "Change Page Size" })
            }
          />
        </TableControlInnerRow>
      </TableControlOuterRow>
      <TableContainer hide={showSkeleton}>
        <Table
          data-test-id="tests-table"
          rowKey={rowKey}
          pagination={false}
          columns={columns}
          dataSource={dataSource}
          onChange={tableChangeHandler}
        />
      </TableContainer>
      {showSkeleton && (
        <Skeleton active title={false} paragraph={{ rows: 8 }} />
      )}
    </>
  );
};

const statusToBadgeColor = {
  [TestStatus.Pass]: Variant.Green,
  [TestStatus.Fail]: Variant.Red,
  [TestStatus.SilentFail]: Variant.Blue,
  [TestStatus.Skip]: Variant.Yellow,
};
const statusCopy = {
  [TestStatus.Pass]: "Pass",
  [TestStatus.Fail]: "Fail",
  [TestStatus.Skip]: "Skip",
  [TestStatus.SilentFail]: "Silent Fail",
};
const columnsTemplate: ColumnProps<TestResult>[] = [
  {
    title: "Name",
    dataIndex: "testFile",
    key: TestSortCategory.TestName,
    width: "40%",
    sorter: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: TestSortCategory.Status,
    sorter: true,
    width: "20%",
    render: (status: string): JSX.Element => (
      <span>
        <Badge
          variant={statusToBadgeColor[status] || Variant.LightGray}
          key={status}
        >
          {statusCopy[status] || ""}
        </Badge>
      </span>
    ),
  },
  {
    title: "Time",
    width: "20%",
    dataIndex: "duration",
    key: TestSortCategory.Duration,
    sorter: true,
    render: (text: number): string => {
      const ms = text * 1000;
      return msToDuration(Math.trunc(ms));
    },
  },
  {
    title: "Logs",
    width: "20%",
    dataIndex: "logs",
    key: "logs",
    sorter: false,
    render: ({
      htmlDisplayURL,
      rawDisplayURL,
    }: {
      htmlDisplayURL: string;
      rawDisplayURL: string;
    }): JSX.Element => (
      <>
        {htmlDisplayURL && (
          <ButtonWrapper>
            <Button
              data-cy="test-table-html-btn"
              size="small"
              target="_blank"
              variant="default"
              href={htmlDisplayURL}
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
          >
            Raw
          </Button>
        )}
      </>
    ),
  },
];

export const rowKey = ({ id }: { id: string }): string => id;

const ButtonWrapper = styled("span")`
  margin-right: 8px;
`;

const getQueryVariables = (
  search: string,
  resourceId: string
): TaskTestsQueryVariables => {
  const parsed = parseQueryString(search);
  const category = (parsed[RequiredQueryParams.Category] ?? "")
    .toString()
    .toUpperCase();
  const cat =
    category === TestSortCategory.TestName ||
    category === TestSortCategory.Status ||
    category === TestSortCategory.Duration
      ? (category as TestSortCategory)
      : TestSortCategory.Status;
  const testName = (parsed[RequiredQueryParams.TestName] ?? "").toString();
  const sort = (parsed[RequiredQueryParams.Sort] ?? "").toString();
  const dir =
    sort === SortDirection.Desc ? SortDirection.Desc : SortDirection.Asc;
  const rawStatuses = parsed[RequiredQueryParams.Statuses];
  const statusList = (Array.isArray(rawStatuses)
    ? rawStatuses
    : [rawStatuses]
  ).filter((v) => v && v !== TestStatus.All);
  const execution = parsed[RequiredQueryParams.Execution];
  return {
    id: resourceId,
    cat,
    dir,
    limitNum: getLimitFromSearch(search),
    statusList,
    testName,
    pageNum: getPageFromSearch(search),
    execution: ExecutionAsData(queryParamAsNumber(execution)),
  };
};
