import React, { useEffect, useState } from "react";
import Table, { ColumnProps } from "antd/es/table";
import { msToDuration } from "utils/string";
import Button from "@leafygreen-ui/button";
import { GET_TASK_TESTS } from "gql/queries/get-task-tests";
import {
  TaskTestsQuery,
  TaskTestsQueryVariables,
  SortDirection,
  TestSortCategory,
  TestResult,
  TaskTestResult,
} from "gql/generated/types";
import { TestStatus, RequiredQueryParams, TableOnChange } from "types/task";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled/macro";
import get from "lodash/get";
import queryString from "query-string";
import { useDisableTableSortersIfLoading } from "hooks";
import { NetworkStatus } from "apollo-client";
import { ResultCountLabel } from "components/ResultCountLabel";
import { Skeleton, Pagination } from "antd";
import { PageSizeSelector, PAGE_SIZES } from "components/PageSizeSelector";

const arrayFormat = "comma";

export interface UpdateQueryArg {
  taskTests: TaskTestResult;
}

export const TestsTableCore: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { replace, listen } = useHistory();
  const { search, pathname } = useLocation();
  const [initialQueryVariables] = useState<TaskTestsQueryVariables>({
    id,
    ...getQueryVariables(search),
  });

  const { data, fetchMore, networkStatus, error } = useQuery<
    TaskTestsQuery,
    TaskTestsQueryVariables
  >(GET_TASK_TESTS, {
    variables: initialQueryVariables,
    notifyOnNetworkStatusChange: true,
  });
  useDisableTableSortersIfLoading(networkStatus);

  // this fetch is when url params change (sort direction, sort category, status list)
  // and the page num is set to 0
  useEffect(
    () =>
      listen(async (loc) => {
        try {
          await fetchMore({
            variables: {
              ...getQueryVariables(loc.search),
            },
            updateQuery: (
              prev: UpdateQueryArg,
              { fetchMoreResult }: { fetchMoreResult: UpdateQueryArg }
            ) => {
              if (!fetchMoreResult) {
                return prev;
              }
              return fetchMoreResult;
            },
          });
        } catch (e) {
          // empty block
        }
      }),
    [networkStatus, error, fetchMore, listen]
  );

  if (!data && networkStatus < NetworkStatus.ready) {
    return <Skeleton active title={false} paragraph={{ rows: 8 }} />;
  }

  const dataSource: [TestResult] = get(data, "taskTests.testResults", []);

  const tableChangeHandler: TableOnChange<TestResult> = (
    ...[, , { order, columnKey }]
  ) => {
    const nextQueryParams = queryString.stringify(
      {
        ...queryString.parse(search, { arrayFormat }),
        [RequiredQueryParams.Category]: columnKey,
        [RequiredQueryParams.Sort]:
          order === "ascend" ? SortDirection.Asc : SortDirection.Desc,
        [RequiredQueryParams.Page]: "0",
      },
      { arrayFormat }
    );
    if (nextQueryParams !== search.split("?")[1]) {
      replace(`${pathname}?${nextQueryParams}`);
    }
  };

  const setPage = (page: number) =>
    replace(
      `${pathname}?${queryString.stringify(
        {
          ...queryString.parse(search, { arrayFormat }),
          page,
        },
        { arrayFormat }
      )}`
    );

  // initial table sort button state to reflect initial URL query params
  const { cat, dir, pageNum, limitNum } = getQueryVariables(search);

  columns.find(({ key }) => key === cat).defaultSortOrder =
    dir === SortDirection.Asc ? "ascend" : "descend";

  return (
    <>
      <OuterRow>
        <ResultCountLabel
          dataCyNumerator="filtered-test-count"
          dataCyDenominator="total-test-count"
          label="tests"
          numerator={get(data, "taskTests.filteredTestCount", "-")}
          denominator={get(data, "taskTests.totalTestCount", "-")}
        />
        <InnerRow>
          <Pagination
            simple
            pageSize={limitNum}
            current={pageNum + 1}
            total={get(data, "taskTests.filteredTestCount", 0)}
            onChange={(p) => setPage(p - 1)}
          />
          <PageSizeSelector value={limitNum} />
        </InnerRow>
      </OuterRow>
      <Table
        rowKey={rowKey}
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        onChange={tableChangeHandler}
      />
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
const columns: ColumnProps<TestResult>[] = [
  {
    title: "Name",
    dataIndex: "testFile",
    key: TestSortCategory.TestName,
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
  margin-right: 8;
`;

const getQueryVariables = (
  search: string
): {
  cat: TestSortCategory;
  dir: SortDirection;
  limitNum: number;
  statusList: string[];
  testName: string;
  pageNum: number;
} => {
  const parsed = queryString.parse(search, { arrayFormat });
  const category = (parsed[RequiredQueryParams.Category] || "")
    .toString()
    .toUpperCase();
  const cat =
    category === TestSortCategory.TestName ||
    category === TestSortCategory.Status ||
    category === TestSortCategory.Duration
      ? (category as TestSortCategory)
      : TestSortCategory.Status;
  const page = parseInt(
    (parsed[RequiredQueryParams.Page] || "").toString(),
    10
  );
  const limit = parseInt(
    (parsed[RequiredQueryParams.Limit] || "").toString(),
    10
  );
  const testName = (parsed[RequiredQueryParams.TestName] || "").toString();
  const sort = (parsed[RequiredQueryParams.Sort] || "").toString();
  const dir =
    sort === SortDirection.Desc ? SortDirection.Desc : SortDirection.Asc;
  const rawStatuses = parsed[RequiredQueryParams.Statuses];
  const statusList = (Array.isArray(rawStatuses)
    ? rawStatuses
    : [rawStatuses]
  ).filter((v) => v && v !== TestStatus.All);
  return {
    cat,
    dir,
    limitNum: !Number.isNaN(limit) && PAGE_SIZES.includes(limit) ? limit : 10,
    statusList,
    testName,
    pageNum: !Number.isNaN(page) && page >= 0 ? page : 0,
  };
};

const InnerRow = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const OuterRow = styled(InnerRow)`
  padding-bottom: 8px;
`;
