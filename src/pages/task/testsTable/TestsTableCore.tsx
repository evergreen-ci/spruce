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
  TestStatus,
  UpdateQueryArg
} from "gql/queries/get-task-tests";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { usePrevious } from "hooks";
import styled from "@emotion/styled/macro";
import {
  RequiredQueryParams,
  SortQueryParam,
  ValidInitialQueryParams,
  TableOnChange
} from "types/task";
import get from "lodash.get";
import queryString from "query-string";
import { NetworkStatus } from "apollo-client";

const LIMIT = 10;

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
      let color: Variant = Variant.LightGray;
      switch (tag) {
        case TestStatus.Succeeded:
          color = Variant.Green;
          break;
        case TestStatus.Failed:
          color = Variant.Red;
          break;
        case TestStatus.SilentlyFailed:
          color = Variant.Blue;
          break;
        case TestStatus.Skipped:
          color = Variant.Yellow;
          break;
      }
      return (
        <span>
          <Badge variant={color} key={tag}>
            {tag.toUpperCase()}
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

export const TestsTableCore: React.FC<ValidInitialQueryParams> = ({
  initialSort,
  initialCategory
}) => {
  const { id } = useParams<{ id: string }>();
  const { search, pathname } = useLocation();
  const { replace } = useHistory();
  const { data, fetchMore, networkStatus, error } = useQuery<
    TaskTestsData,
    TakskTestsVars
  >(GET_TASK_TESTS, {
    variables: {
      id,
      dir: initialSort === SortQueryParam.Asc ? "ASC" : "DESC",
      cat: initialCategory as Categories,
      pageNum: 0,
      limitNum: LIMIT
    },
    notifyOnNetworkStatusChange: true
  });
  const parsed = queryString.parse(search);
  const category = (parsed[RequiredQueryParams.Category] || "")
    .toString()
    .toUpperCase();
  const sort = parsed[RequiredQueryParams.Sort];
  const prevCategory = usePrevious(category);
  const prevSort = usePrevious(sort);
  useEffect(() => {
    const elements = document.querySelectorAll(
      "th.ant-table-column-has-actions.ant-table-column-has-sorters"
    );
    if (networkStatus < NetworkStatus.ready) {
      elements.forEach(el => {
        (el as HTMLElement).style["pointer-events"] = "none";
      });
    } else {
      elements.forEach(el => {
        (el as HTMLElement).style["pointer-events"] = "auto";
      });
    }
  }, [networkStatus]);
  if (
    (sort !== prevSort || category !== prevCategory) &&
    networkStatus === NetworkStatus.ready &&
    !error
  ) {
    fetchMore({
      variables: {
        cat: category,
        dir: sort === SortQueryParam.Asc ? "ASC" : "DESC",
        pageNum: 0,
        limitNum: LIMIT
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
  }
  const dataSource: [TaskTestsData] = get(data, "taskTests", []);
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
        cat: category,
        dir: sort === SortQueryParam.Asc ? "ASC" : "DESC",
        limitNum: LIMIT
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

const ButtonWrapper = styled.span({
  marginRight: 8
});
