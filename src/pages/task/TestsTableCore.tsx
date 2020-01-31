import React, { useEffect } from "react";
import { ColumnProps, TableProps } from "antd/es/table";
import { InfinityTable } from "antd-table-infinity";
import { msToDuration } from "utils/string";
import { Tag, Spin } from "antd";
import { TESTS_QUERY } from "utils/gql/queries";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { usePrevious } from "utils/hooks";
import {
  Categories,
  RequiredQueryParams,
  Sort,
  ValidInitialQueryParams,
  Limit
} from "pages/task/types";
import get from "lodash.get";
import queryString from "query-string";

interface TaskTests {
  id: string;
  status: string;
  testFile: string;
  duration: number;
}

interface UpdateQueryArg {
  taskTests: [TaskTests];
}

const loadMoreContent = (): JSX.Element => (
  <div
    style={{
      textAlign: "center",
      paddingTop: 40,
      paddingBottom: 40,
      border: "1px solid #e8e8e8"
    }}
  >
    <Spin tip="Loading..." />
  </div>
);
const columns: Array<ColumnProps<TaskTests>> = [
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
    render: (tag: string): JSX.Element => {
      const color = tag === "pass" ? "green" : "geekblue";
      return (
        <span>
          <Tag color={color} key={tag}>
            {tag.toUpperCase()}
          </Tag>
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
      return msToDuration(text.toFixed());
    }
  }
];
const rowKey = ({ id }) => id;
type Props = ValidInitialQueryParams & Limit;
export const TestsTableCore: React.FC<Props> = ({
  initialSort,
  initialCategory,
  limit
}) => {
  const { taskID } = useParams();
  const { search, pathname } = useLocation();
  const { replace } = useHistory();
  const { data, fetchMore, networkStatus } = useQuery(TESTS_QUERY, {
    variables: {
      id: taskID,
      dir: initialSort === Sort.Asc ? "ASC" : "DESC",
      cat: initialCategory,
      pageNum: 0,
      limitNum: limit
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
    if (networkStatus < 7) {
      elements.forEach(el => {
        (el as HTMLElement).style["pointer-events"] = "none";
      });
    } else {
      elements.forEach(el => {
        (el as HTMLElement).style["pointer-events"] = "auto";
      });
    }
  }, [networkStatus]);

  if ((sort !== prevSort || category !== prevCategory) && networkStatus >= 7) {
    fetchMore({
      variables: {
        cat: category,
        dir: sort === Sort.Asc ? "ASC" : "DESC",
        pageNum: 0,
        limitNum: limit
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
  const dataSource: [TaskTests] = get(data, "taskTests", []);
  const onFetch = () => {
    fetchMore({
      variables: {
        pageNum: dataSource.length / limit,
        cat: category,
        dir: sort === Sort.Asc ? "ASC" : "DESC",
        limitNum: limit
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

  const onChange: TableProps<TaskTests>["onChange"] = (...[, , sorter]) => {
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
        loading={networkStatus < 7}
        onFetch={onFetch}
        pageSize={10000}
        loadingIndicator={loadMoreContent()}
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
