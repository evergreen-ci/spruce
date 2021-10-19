import { ColumnProps } from "antd/es/table";
import { Analytics } from "analytics/addPageAction";
import {
  InputFilterProps,
  getColumnSearchFilterProps,
  getColumnTreeSelectFilterProps,
} from "components/Table/Filters";
import { TreeSelectProps } from "components/TreeSelect";
import { WordBreak } from "components/Typography";
import { TestSortCategory, TestResult } from "gql/generated/types";
import { string } from "utils";
import { LogsColumn } from "./LogsColumn";
import { TestStatusBadge } from "./TestStatusBadge";

const { msToDuration } = string;

interface GetColumnsTemplateParams {
  taskAnalytics: Analytics<
    | { name: "Click Logs Lobster Button" }
    | { name: "Click Logs HTML Button" }
    | { name: "Click Logs Raw Button" }
  >;
  onColumnHeaderClick: (sortField) => void;
  statusSelectorProps: TreeSelectProps;
  testNameInputProps: InputFilterProps;
}

export const getColumnsTemplate = ({
  taskAnalytics,
  onColumnHeaderClick,
  statusSelectorProps,
  testNameInputProps,
}: GetColumnsTemplateParams): ColumnProps<TestResult>[] => [
  {
    title: <span data-cy="name-column">Name</span>,
    dataIndex: "testFile",
    key: TestSortCategory.TestName,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick("name");
      },
    }),
    width: "40%",
    render: (testFile) => <WordBreak>{testFile}</WordBreak>,
    sorter: true,
    ...getColumnSearchFilterProps(testNameInputProps),
  },
  {
    title: <span data-cy="status-column">Status</span>,
    dataIndex: "status",
    key: TestSortCategory.Status,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick("status");
      },
    }),
    sorter: true,
    className: "data-cy-status-column",
    render: (status: string): JSX.Element => (
      <TestStatusBadge status={status} />
    ),
    ...getColumnTreeSelectFilterProps({
      ...statusSelectorProps,
      "data-cy": "status-treeselect",
    }),
  },
  {
    title: <span data-cy="base-status-column">Base Status</span>,
    dataIndex: "baseStatus",
    key: TestSortCategory.BaseStatus,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick("baseStatus");
      },
    }),
    sorter: true,
    render: (status: string): JSX.Element => (
      <TestStatusBadge status={status} />
    ),
  },
  {
    title: <span data-cy="time-column">Time</span>,
    dataIndex: "duration",
    key: TestSortCategory.Duration,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick("time");
      },
    }),
    sorter: true,
    render: (text: number): string => {
      const ms = text * 1000;
      return msToDuration(Math.trunc(ms));
    },
  },
  {
    title: <span data-cy="logs-column">Logs</span>,
    width: 230,
    dataIndex: "logs",
    key: "logs",
    sorter: false,
    render: (a, b): JSX.Element => (
      <LogsColumn taskAnalytics={taskAnalytics} testResult={b} />
    ),
  },
];
