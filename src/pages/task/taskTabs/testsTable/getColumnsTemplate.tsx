import { ColumnProps } from "antd/es/table";
import { WordBreak } from "components/styles";
import {
  InputFilterProps,
  getColumnSearchFilterProps,
  getColumnTreeSelectFilterProps,
} from "components/Table/Filters";
import { TreeSelectProps } from "components/TreeSelect";
import { TestSortCategory, TestResult, TaskQuery } from "gql/generated/types";
import { string } from "utils";
import { LogsColumn } from "./LogsColumn";
import { TestStatusBadge } from "./TestStatusBadge";

const { msToDuration } = string;

interface GetColumnsTemplateParams {
  onColumnHeaderClick?: (sortField) => void;
  statusSelectorProps: TreeSelectProps;
  testNameInputProps: InputFilterProps;
  task: TaskQuery["task"];
}

export const getColumnsTemplate = ({
  onColumnHeaderClick = () => undefined,
  statusSelectorProps,
  task,
  testNameInputProps,
}: GetColumnsTemplateParams): ColumnProps<TestResult>[] => [
  {
    dataIndex: "testFile",
    key: TestSortCategory.TestName,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick(TestSortCategory.TestName);
      },
    }),
    render: (testFile) => <WordBreak>{testFile}</WordBreak>,
    sorter: true,
    title: <span data-cy="name-column">Name</span>,
    width: "40%",
    ...getColumnSearchFilterProps(testNameInputProps),
  },
  {
    className: "data-cy-status-column",
    dataIndex: "status",
    key: TestSortCategory.Status,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick(TestSortCategory.Status);
      },
    }),
    render: (status: string): JSX.Element => (
      <TestStatusBadge status={status} />
    ),
    sorter: true,
    title: <span data-cy="status-column">Status</span>,
    ...getColumnTreeSelectFilterProps({
      ...statusSelectorProps,
      "data-cy": "status-treeselect",
    }),
  },
  {
    dataIndex: "baseStatus",
    key: TestSortCategory.BaseStatus,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick(TestSortCategory.BaseStatus);
      },
    }),
    render: (status: string): JSX.Element => (
      <TestStatusBadge status={status} />
    ),
    sorter: true,
    title: (
      <span data-cy="base-status-column">
        {task.versionMetadata.isPatch ? "Base" : "Previous"} Status
      </span>
    ),
  },
  {
    dataIndex: "duration",
    key: TestSortCategory.Duration,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick(TestSortCategory.Duration);
      },
    }),
    render: (text: number): string => {
      const ms = text * 1000;
      return msToDuration(Math.trunc(ms));
    },
    sorter: true,
    title: <span data-cy="time-column">Time</span>,
  },
  {
    dataIndex: "logs",
    key: "logs",
    render: (a, b): JSX.Element => <LogsColumn testResult={b} task={task} />,
    sorter: false,
    title: <span data-cy="logs-column">Logs</span>,
    width: 230,
  },
];
