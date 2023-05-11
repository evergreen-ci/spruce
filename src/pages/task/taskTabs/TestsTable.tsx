import { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { Table } from "antd";
import { SortOrder } from "antd/es/table/interface";
import { useLocation } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import PageSizeSelector, {
  usePageSizeSelector,
} from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { ResultCountLabel } from "components/ResultCountLabel";
import {
  TableContainer,
  TableControlOuterRow,
  TableControlInnerRow,
} from "components/styles";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { testStatusesFilterTreeData } from "constants/test";
import {
  TaskTestsQuery,
  SortDirection,
  TestSortCategory,
  TestResult,
  TaskQuery,
  TaskTestsQueryVariables,
} from "gql/generated/types";
import { GET_TASK_TESTS } from "gql/queries";
import {
  useUpdateURLQueryParams,
  usePolling,
  useStatusesFilter,
  useFilterInputChangeHandler,
} from "hooks";
import { RequiredQueryParams, TableOnChange } from "types/task";
import { TestStatus } from "types/test";
import { queryString, url } from "utils";
import { getColumnsTemplate } from "./testsTable/getColumnsTemplate";

const { getPageFromSearch, getLimitFromSearch } = url;
const { parseQueryString, queryParamAsNumber } = queryString;

interface TestsTableProps {
  task: TaskQuery["task"];
}
export const TestsTable: React.VFC<TestsTableProps> = ({ task }) => {
  const { pathname, search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const taskAnalytics = useTaskAnalytics();
  const sendFilterTestsEvent = (filterBy: string) =>
    taskAnalytics.sendEvent({ name: "Filter Tests", filterBy });

  const queryVariables = getQueryVariables(search, task.id);
  const { sort, pageNum, limitNum } = queryVariables;
  const cat = sort?.[0]?.sortBy;
  const dir = sort?.[0]?.direction;

  const setPageSize = usePageSizeSelector();
  const appliedDefaultSort = useRef(null);
  useEffect(() => {
    if (
      cat === undefined &&
      updateQueryParams &&
      appliedDefaultSort.current !== pathname
    ) {
      appliedDefaultSort.current = pathname;
      updateQueryParams({
        [RequiredQueryParams.Category]: TestSortCategory.Status,
        [RequiredQueryParams.Sort]: SortDirection.Asc,
      });
    }
  }, [pathname, updateQueryParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const statusesFilter = useStatusesFilter({
    urlParam: RequiredQueryParams.Statuses,
    resetPage: false,
    sendAnalyticsEvent: sendFilterTestsEvent,
  });

  const statusSelectorProps = {
    state: statusesFilter.inputValue,
    tData: testStatusesFilterTreeData,
    onChange: statusesFilter.setAndSubmitInputValue,
  };

  const testNameFilterInputChangeHandler = useFilterInputChangeHandler({
    urlParam: RequiredQueryParams.TestName,
    resetPage: true,
    sendAnalyticsEvent: sendFilterTestsEvent,
  });

  const testNameInputProps = {
    "data-cy": "testname-input",
    placeholder: "Test name regex",
    value: testNameFilterInputChangeHandler.inputValue,
    onChange: ({ target }) =>
      testNameFilterInputChangeHandler.setInputValue(target.value),
    onFilter: testNameFilterInputChangeHandler.submitInputValue,
  };

  const columns = getColumnsTemplate({
    onColumnHeaderClick: (sortField) =>
      taskAnalytics.sendEvent({ name: "Sort Tests Table", sortBy: sortField }),
    statusSelectorProps,
    testNameInputProps,
    task,
  }).map((column) => ({
    ...column,
    ...(column.key === cat && {
      sortOrder: (dir === SortDirection.Asc
        ? "ascend"
        : "descend") as SortOrder,
    }),
  }));

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    TaskTestsQuery,
    TaskTestsQueryVariables
  >(GET_TASK_TESTS, {
    variables: queryVariables,
    skip: queryVariables.execution === null,
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  usePolling({ startPolling, stopPolling, refetch });

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
  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
    taskAnalytics.sendEvent({ name: "Change Page Size" });
  };

  const { task: taskData } = data ?? {};
  const { tests } = taskData ?? {};
  const { filteredTestCount, totalTestCount, testResults } = tests ?? {};

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
            onChange={handlePageSizeChange}
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
          getPopupContainer={(trigger: HTMLElement) => trigger}
          onChange={tableChangeHandler}
          loading={loading}
        />
      </TableContainer>
    </>
  );
};

export const rowKey = ({ id }: { id: string }): string => id;

const getQueryVariables = (
  search: string,
  taskId: string
): TaskTestsQueryVariables => {
  const parsed = parseQueryString(search);

  // Detemining sort category
  const parsedCategory = (parsed[RequiredQueryParams.Category] ?? "")
    .toString()
    .toUpperCase();
  const TestSortCategories = Object.keys(TestSortCategory).map(
    (k) => TestSortCategory[k]
  );
  const sortBy = TestSortCategories.includes(parsedCategory)
    ? (parsedCategory as TestSortCategory)
    : undefined;

  // Determining sort direction
  const parsedDirection = (parsed[RequiredQueryParams.Sort] ?? "").toString();
  const direction =
    parsedDirection === SortDirection.Desc
      ? SortDirection.Desc
      : SortDirection.Asc;

  const sort = sortBy && direction ? [{ sortBy, direction }] : [];

  const testName = (parsed[RequiredQueryParams.TestName] ?? "").toString();
  const rawStatuses = parsed[RequiredQueryParams.Statuses];
  const statusList = (
    Array.isArray(rawStatuses) ? rawStatuses : [rawStatuses]
  ).filter((v) => v && v !== TestStatus.All);
  const execution = parsed[RequiredQueryParams.Execution];
  return {
    id: taskId,
    execution: queryParamAsNumber(execution),
    sort,
    limitNum: getLimitFromSearch(search),
    statusList,
    testName,
    pageNum: getPageFromSearch(search),
  };
};
