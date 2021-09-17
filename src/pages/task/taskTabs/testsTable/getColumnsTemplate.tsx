import { ColumnProps } from "antd/es/table";
import { Analytics } from "analytics/addPageAction";
import Badge, { Variant } from "components/Badge";
import {
  InputFilterProps,
  getColumnSearchFilterProps,
  getColumnTreeSelectFilterProps,
} from "components/Table/Filters";
import { TreeSelectProps } from "components/TreeSelect";
import { WordBreak } from "components/Typography";
import { statusToBadgeColor, statusCopy } from "constants/test";
import { TestSortCategory, TestResult } from "gql/generated/types";
import { string } from "utils";
import { LogsColumn } from "./LogsColumn";

const { msToDuration } = string;

interface GetColumnsTemplateParams {
  taskAnalytics: Analytics<
    | { name: "Click Logs Lobster Button" }
    | { name: "Click Logs HTML Button" }
    | { name: "Click Logs Raw Button" }
  >;
  statusSelectorProps: TreeSelectProps;
  testNameInputProps: InputFilterProps;
}

export const getColumnsTemplate = ({
  taskAnalytics,
  statusSelectorProps,
  testNameInputProps,
}: GetColumnsTemplateParams): ColumnProps<TestResult>[] => [
  {
    title: <span data-cy="name-column">Name</span>,
    dataIndex: "testFile",
    key: TestSortCategory.TestName,
    width: "40%",
    render: (name, { displayTestName }) => (
      <WordBreak>{displayTestName || name}</WordBreak>
    ),
    sorter: true,
    ...getColumnSearchFilterProps(testNameInputProps),
  },
  {
    title: <span data-cy="status-column">Status</span>,
    dataIndex: "status",
    key: TestSortCategory.Status,
    sorter: true,
    className: "data-cy-status-column",
    render: (status: string): JSX.Element => (
      <span>
        <Badge
          variant={statusToBadgeColor[status] || Variant.LightGray}
          key={status}
        >
          {statusCopy[status] || ""}
        </Badge>
      </span>
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
    sorter: true,
    render: (status: string): JSX.Element => (
      <span>
        <Badge
          variant={statusToBadgeColor[status] || Variant.LightGray}
          key={status}
        >
          {statusCopy[status] || ""}
        </Badge>
      </span>
    ),
  },
  {
    title: <span data-cy="time-column">Time</span>,
    dataIndex: "duration",
    key: TestSortCategory.Duration,
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
