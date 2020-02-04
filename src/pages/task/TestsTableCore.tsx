import React, { useEffect } from "react";
import { ColumnProps, TableProps } from "antd/es/table";
import { InfinityTable } from "antd-table-infinity";
import { msToDuration } from "utils/string";
import { TESTS_QUERY } from "gql/queries";
import { Spin } from "antd";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { usePrevious } from "hooks";
import styled from "@emotion/styled/macro";

import {
  Categories,
  RequiredQueryParams,
  Sort,
  ValidInitialQueryParams,
  TestStatus
} from "pages/task/types";
import get from "lodash.get";
import queryString from "query-string";
import { NetworkStatus } from "apollo-client";
const LIMIT = 10;
type Category = Categories.Duration | Categories.Status | Categories.TestName;

interface TaskTestsData {
  id: string;
  status: string;
  testFile: string;
  duration: number;
}

type SortDir = "ASC" | "DESC";

interface TakskTestsVars {
  id: string;
  dir: SortDir;
  cat: Category;
  pageNum: number;
  limitNum: number;
}

interface UpdateQueryArg {
  taskTests: [TaskTestsData];
}

const SpinWrapper = styled.div({
  textAlign: "center",
  paddingTop: 40,
  paddingBottom: 40,
  border: "1px solid #e8e8e8"
});
const loadMoreContent = (
  <SpinWrapper>
    <Spin tip="Loading..." />
  </SpinWrapper>
);

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
    render: (tag: string) => {
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
    dataIndex: "duration",
    key: Categories.Duration,
    sorter: true,
    render: (text: number): string => {
      return msToDuration(Math.trunc(text));
    }
  }
];
const rowKey = ({ id }) => id;
type Props = ValidInitialQueryParams;
export const TestsTableCore: React.FC<Props> = ({
  initialSort,
  initialCategory
}) => {
  const { taskID } = useParams();
  const { search, pathname } = useLocation();
  const { replace } = useHistory();
  const { data, fetchMore, networkStatus } = useQuery<
    TaskTestsData,
    TakskTestsVars
  >(TESTS_QUERY, {
    variables: {
      id: taskID,
      dir: initialSort === Sort.Asc ? "ASC" : "DESC",
      cat: initialCategory as Category,
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
    networkStatus === NetworkStatus.ready
  ) {
    fetchMore({
      variables: {
        cat: category,
        dir: sort === Sort.Asc ? "ASC" : "DESC",
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
  const onFetch = () => {
    fetchMore({
      variables: {
        pageNum: dataSource.length / LIMIT,
        cat: category,
        dir: sort === Sort.Asc ? "ASC" : "DESC",
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

  const onChange: TableProps<TaskTestsData>["onChange"] = (...[, , sorter]) => {
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
      parsedSearch[RequiredQueryParams.Sort] === Sort.Desc
    ) {
      parsedSearch[RequiredQueryParams.Sort] = Sort.Asc;
      hasDiff = true;
    } else if (
      order === "descend" &&
      parsedSearch[RequiredQueryParams.Sort] === Sort.Asc
    ) {
      parsedSearch[RequiredQueryParams.Sort] = Sort.Desc;
      hasDiff = true;
    }
    if (hasDiff) {
      const nextQueryParams = queryString.stringify(parsedSearch);
      replace(`${pathname}?${nextQueryParams}`);
    }
  };
  // only need sort order set to reflect initial state in URL
  columns.find(({ key }) => key === initialCategory).defaultSortOrder =
    initialSort === Sort.Asc ? "ascend" : "descend";

  return (
    <div>
      <InfinityTable
        key="key"
        loading={networkStatus < NetworkStatus.ready}
        onFetch={onFetch}
        pageSize={10000}
        loadingIndicator={loadMoreContent}
        columns={columns}
        scroll={{ y: 350 }}
        dataSource={dataSource}
        onChange={onChange}
        rowKey={rowKey}
        bordered={true}
      />
    </div>
  );
};
