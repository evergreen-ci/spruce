import { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { SortOrder } from "antd/es/table/interface";
import { useParams, useLocation } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { Analytics } from "analytics/addPageAction";
import Badge, { Variant } from "components/Badge";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { ResultCountLabel } from "components/ResultCountLabel";
import {
  TableContainer,
  TableControlOuterRow,
  TableControlInnerRow,
} from "components/styles";
import { WordBreak } from "components/Typography";
import {
  getLobsterTestLogUrl,
  isLobsterLink,
} from "constants/externalResources";
import { pollInterval } from "constants/index";
import {
  TaskTestsQuery,
  TaskTestsQueryVariables,
  SortDirection,
  TestSortCategory,
  TestResult,
  TaskTestResult,
} from "gql/generated/types";
import { GET_TASK_TESTS } from "gql/queries";
import { useUpdateURLQueryParams, useNetworkStatus } from "hooks";
import { TestStatus, RequiredQueryParams, TableOnChange } from "types/task";
import { queryString, url, string, environmentalVariables } from "utils";

const { getLobsterURL } = environmentalVariables;
const { msToDuration } = string;
const { getPageFromSearch, getLimitFromSearch } = url;
const { parseQueryString, queryParamAsNumber } = queryString;

const DEPRECATED_LOGKEEPER_LOBSTER_URL = "https://logkeeper.mongodb.org";

export interface UpdateQueryArg {
  taskTests: TaskTestResult;
}
export const TestsTableCore: React.FC = () => {
  const { id: resourceId } = useParams<{ id: string }>();
  const { search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const taskAnalytics = useTaskAnalytics();

  const queryVariables = getQueryVariables(search, resourceId);
  const { cat, dir, pageNum, limitNum } = queryVariables;

  const appliedDefaultSort = useRef(false);
  useEffect(() => {
    if (cat === undefined && updateQueryParams && !appliedDefaultSort.current) {
      appliedDefaultSort.current = true;
      updateQueryParams({
        [RequiredQueryParams.Category]: TestSortCategory.Status,
        [RequiredQueryParams.Sort]: SortDirection.Asc,
      });
    }
  }, [updateQueryParams]); // eslint-disable-line react-hooks/exhaustive-deps
  // Apply sorts to columns
  const columns = getColumnsTemplate(taskAnalytics).map((column) => ({
    ...column,
    ...(column.key === cat && {
      sortOrder: (dir === SortDirection.Asc
        ? "ascend"
        : "descend") as SortOrder,
    }),
  }));

  // initial request for task tests
  const { data, startPolling, stopPolling } = useQuery<
    TaskTestsQuery,
    TaskTestsQueryVariables
  >(GET_TASK_TESTS, {
    variables: queryVariables,
    pollInterval,
  });
  useNetworkStatus(startPolling, stopPolling);
  // update url query params when user event triggers change
  const tableChangeHandler: TableOnChange<TestResult> = (...[, , sorter]) => {
    const { order, columnKey } = Array.isArray(sorter) ? sorter[0] : sorter;
    let queryParams = {
      [RequiredQueryParams.Category]: undefined,
      [RequiredQueryParams.Sort]: undefined,
      [RequiredQueryParams.Page]: "0",
    };
    if (order !== undefined) {
      queryParams = {
        ...queryParams,
        [RequiredQueryParams.Category]: `${columnKey}`,
        [RequiredQueryParams.Sort]:
          order === "ascend" ? SortDirection.Asc : SortDirection.Desc,
      };
    }
    updateQueryParams(queryParams);
  };

  const { taskTests } = data ?? {};
  const { filteredTestCount, totalTestCount, testResults } = taskTests ?? {};

  return (
    <>
      <TableControlOuterRow>
        <ResultCountLabel
          dataCyNumerator="filtered-test-count"
          dataCyDenominator="total-test-count"
          label="tests"
          numerator={filteredTestCount}
          denominator={totalTestCount}
        />
        <TableControlInnerRow>
          <Pagination
            pageSize={limitNum}
            value={pageNum}
            totalResults={filteredTestCount}
            data-cy="tests-table-pagination"
          />
          <PageSizeSelector
            data-cy="tests-table-page-size-selector"
            value={limitNum}
            sendAnalyticsEvent={() =>
              taskAnalytics.sendEvent({ name: "Change Page Size" })
            }
          />
        </TableControlInnerRow>
      </TableControlOuterRow>
      <TableContainer>
        <Table
          data-test-id="tests-table"
          rowKey={rowKey}
          pagination={false}
          columns={columns}
          dataSource={testResults}
          onChange={tableChangeHandler}
        />
      </TableContainer>
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

  const TestSortCategories = Object.keys(TestSortCategory).map(
    (k) => TestSortCategory[k]
  );
  const cat = TestSortCategories.includes(category)
    ? (category as TestSortCategory)
    : undefined;
  const testName = (parsed[RequiredQueryParams.TestName] ?? "").toString();
  const sort = (parsed[RequiredQueryParams.Sort] ?? "").toString();
  const dir =
    cat &&
    (sort === SortDirection.Desc ? SortDirection.Desc : SortDirection.Asc);
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
    execution: queryParamAsNumber(execution),
  };
};

const getColumnsTemplate = (
  taskAnalytics: Analytics<
    | { name: "Click Logs Lobster Button" }
    | { name: "Click Logs HTML Button" }
    | { name: "Click Logs Raw Button" }
  >
): ColumnProps<TestResult>[] => [
  {
    title: <span data-cy="name-column">Name</span>,
    dataIndex: "testFile",
    key: TestSortCategory.TestName,
    width: "40%",
    render: (name, { displayTestName }) => (
      <WordBreak>{displayTestName || name}</WordBreak>
    ),
    sorter: true,
  },
  {
    title: <span data-cy="status-column">Status</span>,
    dataIndex: "status",
    key: TestSortCategory.Status,
    sorter: true,
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
    title: <span data-cy="base-status-column">Base Status</span>,
    dataIndex: "baseStatus",
    key: TestSortCategory.BaseStatus,
    sorter: true,
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
    title: <span data-cy="time-column">Time</span>,
    dataIndex: "duration",
    key: TestSortCategory.Duration,
    sorter: true,
    render: (text: number): string => {
      const ms = text * 1000;
      return msToDuration(Math.trunc(ms));
    },
  },
  {
    title: <span data-cy="logs-column">Logs</span>,
    width: 230,
    dataIndex: "logs",
    key: "logs",
    sorter: false,
    render: (a, b): JSX.Element => {
      const { execution, lineNum, taskId, id } = b || {};
      const { htmlDisplayURL, rawDisplayURL } = b?.logs ?? {};
      const lobsterLink = getLobsterTestLogUrl(taskId, execution, id, lineNum);
      return (
        <>
          {htmlDisplayURL && !isLobsterLink(htmlDisplayURL) && lobsterLink && (
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
          {htmlDisplayURL && (
            <ButtonWrapper>
              <Button
                data-cy="test-table-html-btn"
                size="small"
                target="_blank"
                variant="default"
                href={htmlDisplayURL.replace(
                  DEPRECATED_LOGKEEPER_LOBSTER_URL,
                  `${getLobsterURL()}/lobster`
                )}
                onClick={() =>
                  isLobsterLink(htmlDisplayURL)
                    ? taskAnalytics.sendEvent({
                        name: "Click Logs Lobster Button",
                      })
                    : taskAnalytics.sendEvent({
                        name: "Click Logs HTML Button",
                      })
                }
              >
                {isLobsterLink(htmlDisplayURL) ? "Lobster" : "HTML"}
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
    },
  },
];
