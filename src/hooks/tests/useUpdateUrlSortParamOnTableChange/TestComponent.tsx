import React from "react";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { useLocation } from "react-router";
import { useUpdateUrlSortParamOnTableChange } from "hooks";
import { queryString } from "utils";

const { parseQueryString } = queryString;
export const TestComponent = () => {
  const tableChangeHandler = useUpdateUrlSortParamOnTableChange();

  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  return (
    <>
      <div>{`sortBy: ${queryParams.sortBy ?? "none"}`}</div>
      <div>{`sortDir: ${queryParams.sortDir ?? "none"}`}</div>
      <Table
        data-test-id="hosts-table"
        rowKey={({ id }: { id: string }): string => id}
        pagination={false}
        columns={columnsTemplate}
        dataSource={data}
        onChange={tableChangeHandler}
      />
    </>
  );
};

interface Data {
  id: string;
  status: string;
  distro: string;
}

const data = [
  {
    id: "1",
    status: "passed",
    distro: "osx",
  },
  {
    id: "2",
    status: "failed",
    distro: "osx",
  },
  {
    id: "3",
    status: "passed",
    distro: "windows",
  },
];

const columnsTemplate: Array<ColumnProps<Data>> = [
  {
    title: "ID",
    dataIndex: "id",
    key: "ID",
    sorter: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "STATUS",
    sorter: true,
  },
  {
    title: "Distro",
    dataIndex: "distro",
    key: "DISTRO",
    sorter: true,
  },
];
