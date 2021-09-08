import { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { Table } from "antd";
import { SortOrder } from "antd/es/table/interface";
import { useParams, useLocation } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { ResultCountLabel } from "components/ResultCountLabel";
import {
  TableContainer,
  TableControlOuterRow,
  TableControlInnerRow,
} from "components/styles";
import { pollInterval } from "constants/index";
import { testStatusesFilterTreeData } from "constants/test";
import {
  TaskTestsQuery,
  TaskTestsQueryVariables,
  SortDirection,
  TestSortCategory,
  TestResult,
  TaskTestResult,
} from "gql/generated/types";
import { GET_TASK_TESTS } from "gql/queries";
import {
  useUpdateURLQueryParams,
  useNetworkStatus,
  useStatusesFilter,
  useFilterInputChangeHandler,
} from "hooks";
import { RequiredQueryParams, TableOnChange } from "types/task";
import { TestStatus } from "types/test";
import { queryString, url } from "utils";
import { getColumnsTemplate } from "./testsTable/getColumnsTemplate";

const { getPageFromSearch, getLimitFromSearch } = url;
const { parseQueryString, queryParamAsNumber } = queryString;

export interface UpdateQueryArg {
  taskTests: TaskTestResult;
}
export const TestsTable: React.FC = () => {
  const { id: resourceId } = useParams<{ id: string }>();
  const { pathname, search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const taskAnalytics = useTaskAnalytics();
  const sendFilterTestsEvent = (filterBy: string) =>
    taskAnalytics.sendEvent({ name: "Filter Tests", filterBy });

  const queryVariables = getQueryVariables(search, resourceId);
  const { cat, dir, pageNum, limitNum } = queryVariables;

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
    onChange: statusesFilter.setInputValue,
    onReset: statusesFilter.reset,
    onFilter: statusesFilter.submitInputValue,
  };

  const testNameFilterInputChangeHandler = useFilterInputChangeHandler({
    urlParam: RequiredQueryParams.TestName,
    resetPage: true,
    sendAnalyticsEvent: sendFilterTestsEvent,
  });

  const testNameInputProps = {
    "data-cy": "testname-input",
    placeholder: "Test name",
    value: testNameFilterInputChangeHandler.inputValue,
    onChange: ({ target }) =>
      testNameFilterInputChangeHandler.setInputValue(target.value),
    updateUrlParam: testNameFilterInputChangeHandler.submitInputValue,
    resetUrlParam: testNameFilterInputChangeHandler.reset,
  };

  const columns = getColumnsTemplate({
    taskAnalytics,
    statusSelectorProps,
    testNameInputProps,
  }).map((column) => ({
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

export const rowKey = ({ id }: { id: string }): string => id;

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
