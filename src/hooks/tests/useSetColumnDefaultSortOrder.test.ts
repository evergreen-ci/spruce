import { renderHook } from "@testing-library/react-hooks";
import { useSetColumnDefaultSortOrder } from "hooks";
import { ColumnProps } from "antd/lib/table";
import { TestResult, SortDirection } from "gql/generated/types";

test("Should add a defaultSortOrder key with the supplied direction to the column item with a key matching the supplied category", () => {
  const columns: ColumnProps<TestResult>[] = [
    {
      title: "Name",
      dataIndex: "testFile",
      key: "testName",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: true,
      width: "20%",
    },
  ];

  renderHook(() =>
    useSetColumnDefaultSortOrder(columns, "testName", SortDirection.Asc)
  );

  expect(columns).toStrictEqual([
    {
      title: "Name",
      dataIndex: "testFile",
      key: "testName",
      sorter: true,
      defaultSortOrder: "ascend",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: true,
      width: "20%",
    },
  ]);
});

test("Should not make any changes to columns if the supplied category is not found", () => {
  const columns: ColumnProps<TestResult>[] = [
    {
      title: "Name",
      dataIndex: "testFile",
      key: "testName",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: true,
      width: "20%",
    },
  ];

  renderHook(() =>
    useSetColumnDefaultSortOrder(columns, "crazy stuff", SortDirection.Asc)
  );

  expect(columns).toStrictEqual([
    {
      title: "Name",
      dataIndex: "testFile",
      key: "testName",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: true,
      width: "20%",
    },
  ]);
});
