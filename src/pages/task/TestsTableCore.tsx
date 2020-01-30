import React from "react";
import { TESTS_QUERY } from "utils/gql/queries";
import { msToTime } from "utils/string";
import { Tag, Spin } from "antd";
import { InfinityTable } from "antd-table-infinity";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import queryString from "query-string";
import { Categories, RequiredQueryParams, Sort } from "utils/enums";

const loadMoreContent = () => (
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
const columns = [
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
  sort: string | string[];
  category: string | string[];
}> = ({
  sort,
  category
}: {
  sort: string | string[];
  category: string | string[];
}) => {
  const { taskID } = useParams();
  const { search, pathname } = useLocation();
  const { replace } = useHistory();
  const { loading, error, data, fetchMore } = useQuery(TESTS_QUERY, {
    variables: {
      id: taskID,
      dir: sort === "1" ? "ASC" : "DESC",
      cat: category
    }
  });
  const dataSource = data && data.taskTests ? data.taskTests : [];
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
  columns.find(({ key }) => key === category)["defaultSortOrder"] =
    sort === Sort.Asc ? "ascend" : "descend";
  return (
    <div>
      <InfinityTable
        key="key"
        loading={loading}
        onFetch={() => {
          console.log("handle fetch");
        }}
        pageSize={2000}
        loadingIndicator={loadMoreContent()}
        columns={columns}
        scroll={{ y: 300 }}
        dataSource={dataSource}
        onChange={onChange}
        bordered
      />
    </div>
  );
  return <div />;
};
