import React, { useEffect } from "react";
import { TESTS_QUERY } from "utils/gql/queries";
import { msToTime } from "utils/string";
import { Tag, Spin } from "antd";
import { InfinityTable } from "antd-table-infinity";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import queryString from "query-string";
import { Categories, RequiredQueryParams, Sort } from "utils/enums";
import get from "lodash.get";
import { ColumnProps, TableProps } from "antd/es/table";

interface TaskTests {
  id: String;
  status: String;
  testFile: String;
  duration: Number;
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
const columns: ColumnProps<TaskTests>[] = [
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

export const TestsTableCore: React.FC<{
  initialSort: string | string[];
  initialCategory: string | string[];
}> = ({
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
  }, [category, sort]);

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
  const onChange: TableProps<TaskTests>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    const parsed = queryString.parse(search);
    const { order, columnKey } = sorter;
    let hasDiff = false;
    if (
      columnKey !==
      parsed[RequiredQueryParams.Category].toString().toUpperCase()
    ) {
      parsed[RequiredQueryParams.Category] = columnKey;
      hasDiff = true;
    }

    if (order === "ascend" && parsed[RequiredQueryParams.Sort] === Sort.Desc) {
      parsed[RequiredQueryParams.Sort] = Sort.Asc;
      hasDiff = true;
    } else if (
      order === "descend" &&
      parsed[RequiredQueryParams.Sort] === Sort.Asc
    ) {
      parsed[RequiredQueryParams.Sort] = Sort.Desc;
      hasDiff = true;
    }
    if (hasDiff) {
      const nextQueryParams = queryString.stringify(parsed);
      replace(`${pathname}?${nextQueryParams}`);
    }
  };
  // only need sort order set to reflect initial state in URL
  columns.find(({ key }) => key === initialCategory)["defaultSortOrder"] =
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
        bordered
      />
    </div>
  );
};
