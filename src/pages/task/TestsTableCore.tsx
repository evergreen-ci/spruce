import React, { useEffect } from "react";
import { ColumnProps, TableProps } from "antd/es/table";
import { InfinityTable } from "antd-table-infinity";
import { msToTime } from "utils/string";
import { Tag, Spin } from "antd";
import { TESTS_QUERY } from "utils/gql/queries";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import {
  Categories,
  RequiredQueryParams,
  Sort,
  ValidInitialQueryParams
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
    render: tag => {
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
    render: (text, record, index) => {
      return msToTime(text.toFixed());
    }
  }
];

export const TestsTableCore: React.FC<ValidInitialQueryParams> = ({
  initialSort,
  initialCategory
}: {
  initialSort: string | string[];
  initialCategory: string | string[];
}) => {
  const { taskID } = useParams();
  const { search, pathname } = useLocation();
  const { replace } = useHistory();

  const { data, fetchMore, networkStatus } = useQuery(TESTS_QUERY, {
    variables: {
      id: taskID,
      dir: initialSort === Sort.Asc ? "ASC" : "DESC",
      cat: initialCategory
    },
    notifyOnNetworkStatusChange: true
  });
  const parsed = queryString.parse(search);
  const category = (parsed[RequiredQueryParams.Category] || "")
    .toString()
    .toUpperCase();
  const sort = parsed[RequiredQueryParams.Sort];
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

  useEffect(() => {
    if (networkStatus >= 7) {
      const variables = {
        cat: category,
        dir: sort === Sort.Asc ? "ASC" : "DESC",
        pageNum: 0
      };
      fetchMore({
        variables,
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
  }, [category, sort, fetchMore, networkStatus]);

  const dataSource: [TaskTests] = get(data, "taskTests", []);
  const onFetch = () => {
    fetchMore({
      variables: {
        pageNum: dataSource.length / 10,
        cat: category,
        dir: sort === Sort.Asc ? "ASC" : "DESC"
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
        pageSize={2000}
        loadingIndicator={loadMoreContent}
        columns={columns}
        scroll={{ y: 300 }}
        dataSource={dataSource}
        onChange={onChange}
        bordered={true}
      />
    </div>
  );
};
