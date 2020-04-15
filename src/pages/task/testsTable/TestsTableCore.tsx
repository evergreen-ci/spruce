import React, { useEffect, useState } from "react";
import { ColumnProps } from "antd/es/table";
import { InfinityTable } from "antd-table-infinity";
import { msToDuration } from "utils/string";
import { loader } from "components/Loading/Loader";
import Button from "@leafygreen-ui/button";
import {
  Categories,
  GET_TASK_TESTS,
  TaskTestVars,
  TaskTestsData,
  UpdateQueryArg,
  SortDir,
  TestResult,
} from "gql/queries/get-task-tests";
import { TestStatus } from "types/task";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled/macro";
import { RequiredQueryParams, TableOnChange } from "types/task";
import get from "lodash/get";
import queryString from "query-string";
import { useDisableTableSortersIfLoading } from "hooks";
import { NetworkStatus } from "apollo-client";
import { P2 } from "components/Typography";

const LIMIT = 10;
const arrayFormat = "comma";

export const TestsTableCore: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { replace, listen } = useHistory();
  const { search, pathname } = useLocation();
  const [initialQueryVariables] = useState<TaskTestVars>({
    id,
    pageNum: 0,
    ...getQueryVariables(search),
  });
  const { data, fetchMore, networkStatus, error } = useQuery<
    TaskTestsData,
    TaskTestVars
  >(GET_TASK_TESTS, {
    variables: initialQueryVariables,
    notifyOnNetworkStatusChange: true,
  });
  useDisableTableSortersIfLoading(networkStatus);

  // this fetch is when url params change (sort direction, sort category, status list)
  // and the page num is set to 0
  useEffect(() => {
    return listen(async (loc) => {
      try {
        await fetchMore({
          variables: {
            pageNum: 0,
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
    });
  }, [networkStatus, error, fetchMore, listen]);

  const dataSource: [TestResult] = get(data, "taskTests.testResults", []);

  // this fetch is the callback for pagination
  // that's why we see pageNum calculations
  const onFetch = (): void => {
    if (networkStatus === NetworkStatus.error || error) {
      return;
    }
    const pageNum = dataSource.length / LIMIT;
    if (pageNum % 1 !== 0) {
      return;
    }
    fetchMore({
      variables: {
        pageNum,
        ...getQueryVariables(search),
      },
      updateQuery: (
        prev: UpdateQueryArg,
        { fetchMoreResult }: { fetchMoreResult: UpdateQueryArg }
      ) => {
        if (!fetchMoreResult) {
          return prev;
        }
        fetchMoreResult.taskTests.testResults = [
          ...prev.taskTests.testResults,
          ...fetchMoreResult.taskTests.testResults,
        ];
        return fetchMoreResult;
      },
    });
  };

  const onChange: TableOnChange<TaskTestsData> = (...[, , sorter]) => {
    const parsedSearch = queryString.parse(search);
    const { order, columnKey } = sorter;
    parsedSearch[RequiredQueryParams.Category] = columnKey;
    parsedSearch[RequiredQueryParams.Sort] =
      order === "ascend" ? SortDir.ASC : SortDir.DESC;
    const nextQueryParams = queryString.stringify(parsedSearch, {
      arrayFormat,
    });

    if (nextQueryParams !== search.split("?")[1]) {
      replace(`${pathname}?${nextQueryParams}`);
    }
  };

  // initial table sort button state to reflect initial URL query params
  const { cat, dir } = getQueryVariables(search);
  columns.find(({ key }) => key === cat).defaultSortOrder =
    dir === SortDir.ASC ? "ascend" : "descend";
  const filteredTestCount = get(data, "taskTests.filteredTestCount", "-");
  const totalTestCount = get(data, "taskTests.totalTestCount", "-");
  return (
    <>
      <P2 id="task-count">
        <span data-cy="filtered-test-count">{filteredTestCount}</span>
        {"/"}
        <span data-cy="total-test-count">{totalTestCount}</span>
        <span> tests</span>
      </P2>
      <InfinityTable
        key="key"
        loading={networkStatus < NetworkStatus.ready}
        onFetch={onFetch}
        pageSize={10000}
        loadingIndicator={loader}
        columns={columns}
        scroll={{ y: 350 }}
        dataSource={dataSource}
        onChange={onChange}
        export={true}
        rowKey={rowKey}
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
const columns: Array<ColumnProps<TaskTestsData>> = [
  {
    title: "Name",
    dataIndex: "testFile",
    key: Categories.TestName,
    sorter: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: Categories.Status,
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
    key: Categories.Duration,
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
    }): JSX.Element => {
      return (
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
      );
    },
  },
];

export const rowKey = ({ id }: { id: string }): string => id;

const ButtonWrapper = styled.span({
  marginRight: 8,
});

const getQueryVariables = (search: string) => {
  const parsed = queryString.parse(search, { arrayFormat });
  const category = (parsed[RequiredQueryParams.Category] || "")
    .toString()
    .toUpperCase();
  const cat =
    category === Categories.TestName ||
    category === Categories.Status ||
    category === Categories.Duration
      ? (category as Categories)
      : Categories.Status;

  const testName = (parsed[RequiredQueryParams.TestName] || "").toString();
  const sort = (parsed[RequiredQueryParams.Sort] || "").toString();
  const dir = sort === SortDir.DESC ? SortDir.DESC : SortDir.ASC;
  const rawStatuses = parsed[RequiredQueryParams.Statuses];
  const statusList = (Array.isArray(rawStatuses)
    ? rawStatuses
    : [rawStatuses]
  ).filter((v) => v && v !== TestStatus.All);
  return {
    cat,
    dir,
    limitNum: LIMIT,
    statusList,
    testName,
  };
};
