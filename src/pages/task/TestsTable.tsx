import React, { useEffect } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import queryString from "query-string";
import gql from "graphql-tag";
import { Table, Tag } from "antd";
import { duration, DurationInputArg1 } from "moment";

function msToTime(ms: DurationInputArg1): String {
  var diff = duration(ms, "milliseconds");
  const days = diff.asDays();
  const hours = diff.asHours();
  const minutes = diff.asMinutes();
  const seconds = diff.asSeconds();
  const milli = diff.asMilliseconds();
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  if (seconds > 0) {
    return `${seconds}s ${milli}ms`;
  }
  return `${milli}ms`;
}

enum RequiredQueryParams {
  Sort = "sort",
  Category = "category",
  Page = "page",
  Limit = "limit"
}

enum Categories {
  TestName = "TEST_NAME",
  Duration = "DURATION",
  Status = "STATUS"
}

enum Sort {
  Desc = "-1",
  Asc = "1"
}

enum DefaultQueryParams {
  Sort = "1",
  Category = "TEST_NAME",
  Page = "0",
  Limit = "0"
}

const TESTS_QUERY = gql`
  query GetStuff($dir: SortDirection, $id: String!, $cat: TaskSortCategory) {
    taskTests(taskId: $id, sortCategory: $cat, sortDirection: $dir) {
      id
      status
      testFile
      duration
    }
  }
`;

const columns = [
  {
    title: "Name",
    dataIndex: "testFile",
    key: Categories.TestName,
    sortDirection: "ascend",
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

export const TestsTable: React.FC = () => {
  const { pathname, search } = useLocation();
  const { taskID } = useParams();
  const { replace } = useHistory();
  const parsed = queryString.parse(search);
  const { loading, error, data } = useQuery(TESTS_QUERY, {
    variables: {
      id: taskID,
      dir: parsed[RequiredQueryParams.Sort] === Sort.Asc ? "ASC" : "DESC",
      cat: parsed[RequiredQueryParams.Category]
        ? parsed[RequiredQueryParams.Category].toString()
        : Categories.TestName
    }
  });

  useEffect(() => {
    const parsed = queryString.parse(search);
    const category = (parsed[RequiredQueryParams.Category] || "")
      .toString()
      .toUpperCase();
    const limitNum = parsed[RequiredQueryParams.Limit]
      ? parseInt(parsed[RequiredQueryParams.Limit].toString())
      : -1;
    const pageNum = parsed[RequiredQueryParams.Page]
      ? parseInt(parsed[RequiredQueryParams.Page].toString())
      : -1;
    const sort = parsed[RequiredQueryParams.Sort];

    if (
      (sort !== Sort.Desc && sort !== Sort.Asc) ||
      (category !== Categories.TestName &&
        category !== Categories.Duration &&
        category !== Categories.Status) ||
      !Number.isInteger(pageNum) ||
      pageNum < 0 ||
      !Number.isInteger(limitNum) ||
      limitNum < 0
    ) {
      parsed[RequiredQueryParams.Category] = DefaultQueryParams.Category;
      parsed[RequiredQueryParams.Sort] = DefaultQueryParams.Sort;
      parsed[RequiredQueryParams.Page] = DefaultQueryParams.Page;
      parsed[RequiredQueryParams.Limit] = DefaultQueryParams.Limit;
      const nextQueryParams = queryString.stringify(parsed);
      replace(`${pathname}?${nextQueryParams}`);
    }
  }, [search, pathname, replace]);

  const dataSource = data && data.taskTests ? data.taskTests : null;

  const onChange = (pagination, filters, sorter, extra) => {
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

  return (
    <div>
      <Table onChange={onChange} dataSource={dataSource} columns={columns} />;
    </div>
  );
};
