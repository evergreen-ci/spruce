import React, { useEffect } from "react";
import { ColumnProps } from "antd/es/table";
import { InfinityTable } from "antd-table-infinity";
import { msToDuration } from "utils/string";
import { loader } from "components/Loading/Loader";
import Button from "@leafygreen-ui/button";
import {
  Categories,
  GET_TASK_TESTS,
  TakskTestsVars,
  TaskTestsData,
  UpdateQueryArg
} from "gql/queries/get-task-tests";
import { TestStatus } from "types/task";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled/macro";
import {
  RequiredQueryParams,
  SortQueryParam,
  ValidInitialQueryParams,
  TableOnChange
} from "types/task";
import get from "lodash.get";
import queryString from "query-string";
import { useDisableTableSortersIfLoading } from "hooks";
import { NetworkStatus } from "apollo-client";

const LIMIT = 10;
const arrayFormat = "comma";

export const TestsTableCore: React.FC<ValidInitialQueryParams> = ({
  initialSort,
  initialCategory,
  initialStatuses
}) => {
  const { id } = useParams<{ id: string }>();
  const { search, pathname } = useLocation();
  const { replace, listen } = useHistory();
  // initial fetch
  const { data, fetchMore, networkStatus, error } = useQuery<
    TaskTestsData,
    TakskTestsVars
  >(GET_TASK_TESTS, {
    variables: {
      id,
      dir: initialSort === SortQueryParam.Asc ? "ASC" : "DESC",
      cat: initialCategory as Categories,
      pageNum: 0,
      limitNum: LIMIT,
      statusList: initialStatuses
    },
    notifyOnNetworkStatusChange: true
  });
  useDisableTableSortersIfLoading(networkStatus);

  // this fetch is when url params change (sort direction, sort category, status list)
  // and the page num is set to 0
  useEffect(() => {
    return listen(loc => {
      const parsed = queryString.parse(loc.search, { arrayFormat });
      const category = (parsed[RequiredQueryParams.Category] || "")
        .toString()
        .toUpperCase() as Categories;
      const sort = parsed[RequiredQueryParams.Sort];
      const rawStatuses = parsed[RequiredQueryParams.Statuses];
      const statusList = (Array.isArray(rawStatuses)
        ? rawStatuses
        : [rawStatuses]
      ).filter(v => v && v !== TestStatus.All);
      fetchMore({
        variables: {
          cat: category,
          dir: sort === SortQueryParam.Asc ? "ASC" : "DESC",
          pageNum: 0,
          limitNum: LIMIT,
          statusList: statusList
        },
        updateQuery: (
          prev: UpdateQueryArg,
          { fetchMoreResult }: { fetchMoreResult: UpdateQueryArg }
        ) => {
          if (!fetchMoreResult) {
            return prev;
          }
          return fetchMoreResult;
        }
      });
    });
  }, [networkStatus, error, fetchMore, listen]);

  const dataSource: [TaskTestsData] = get(data, "taskTests", []);

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
    const parsed = queryString.parse(search, { arrayFormat });
    const rawStatuses = parsed[RequiredQueryParams.Statuses];
    const category = (parsed[RequiredQueryParams.Category] || "")
      .toString()
      .toUpperCase() as Categories;
    const sort = parsed[RequiredQueryParams.Sort];
    const statusList = (Array.isArray(rawStatuses)
      ? rawStatuses
      : [rawStatuses]
    ).filter(v => v && v !== TestStatus.All);
    fetchMore({
      variables: {
        pageNum,
        cat: category,
        dir: sort === SortQueryParam.Asc ? "ASC" : "DESC",
        limitNum: LIMIT,
        statusList
      },
      updateQuery: (
        prev: UpdateQueryArg,
        { fetchMoreResult }: { fetchMoreResult: UpdateQueryArg }
      ) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return Object.assign({}, prev, {
          taskTests: [...prev.taskTests, ...fetchMoreResult.taskTests]
        });
      }
    });
  };

  const onChange: TableOnChange<TaskTestsData> = (...[, , sorter]) => {
    const parsedSearch = queryString.parse(search);
    const { order, columnKey } = sorter;
    let hasDiff = false;
    if (
      columnKey !==
      parsedSearch[RequiredQueryParams.Category].toString().toUpperCase()
    ) {
      parsedSearch[RequiredQueryParams.Category] = columnKey;
      hasDiff = true;
    }

    if (
      order === "ascend" &&
      parsedSearch[RequiredQueryParams.Sort] === SortQueryParam.Desc
    ) {
      parsedSearch[RequiredQueryParams.Sort] = SortQueryParam.Asc;
      hasDiff = true;
    } else if (
      order === "descend" &&
      parsedSearch[RequiredQueryParams.Sort] === SortQueryParam.Asc
    ) {
      parsedSearch[RequiredQueryParams.Sort] = SortQueryParam.Desc;
      hasDiff = true;
    }
    if (hasDiff) {
      const nextQueryParams = queryString.stringify(parsedSearch);
      replace(`${pathname}?${nextQueryParams}`);
    }
  };
  // only need sort order set to reflect initial state in URL
  columns.find(({ key }) => key === initialCategory).defaultSortOrder =
    initialSort === SortQueryParam.Asc ? "ascend" : "descend";

  return (
    <div>
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
    </div>
  );
};

const statusCopy = {
  [TestStatus.Pass]: "Pass",
  [TestStatus.Fail]: "Fail",
  [TestStatus.Skip]: "Skip",
  [TestStatus.SilentFail]: "Silent Fail"
};
const columns: Array<ColumnProps<TaskTestsData>> = [
  {
    title: "Name",
    dataIndex: "testFile",
    key: Categories.TestName,
    sorter: true
  },
  {
    title: "Status",
    dataIndex: "status",
    key: Categories.Status,
    sorter: true,
    width: "20%",
    render: (tag: string): JSX.Element => {
      let color: Variant;
      switch (tag) {
        case TestStatus.Pass:
          color = Variant.Green;
          break;
        case TestStatus.Fail:
          color = Variant.Red;
          break;
        case TestStatus.SilentFail:
          color = Variant.Blue;
          break;
        case TestStatus.Skip:
          color = Variant.Yellow;
          break;
        default:
          color = Variant.LightGray;
      }
      return (
        <span>
          <Badge variant={color} key={tag}>
            {statusCopy[tag] || ""}
          </Badge>
        </span>
      );
    }
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
    }
  },
  {
    title: "Logs",
    width: "20%",
    dataIndex: "logs",
    key: "logs",
    sorter: false,
    render: (
      {
        htmlDisplayURL,
        rawDisplayURL
      }: { htmlDisplayURL: string; rawDisplayURL: string },
      { id }
    ): JSX.Element => {
      return (
        <>
          {htmlDisplayURL && (
            <ButtonWrapper>
              <Button
                id={`htmlBtn-${id}`}
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
              id={`rawBtn-${id}`}
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
    }
  }
];

export const rowKey = ({ id }: { id: string }): string => id;

const ButtonWrapper = styled.span({
  marginRight: 8
});
