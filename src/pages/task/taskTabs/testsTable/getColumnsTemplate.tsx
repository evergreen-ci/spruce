import { WordBreak } from "components/styles";
import { testStatusesFilterTreeData } from "constants/test";
import { TestSortCategory, TaskQuery } from "gql/generated/types";
import { string } from "utils";
import { LogsColumn } from "./LogsColumn";
import { TestStatusBadge } from "./TestStatusBadge";

const { msToDuration } = string;

interface GetColumnsTemplateParams {
  task: TaskQuery["task"];
}

export const getColumnsTemplate = ({ task }: GetColumnsTemplateParams) => [
  {
    header: "Name",
    accessorKey: "testFile",
    id: TestSortCategory.TestName,
    cell: ({ getValue }) => <WordBreak>{getValue()}</WordBreak>,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      search: {
        placeholder: "Test name regex",
      },
      width: "40%",
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    id: TestSortCategory.Status,
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ getValue }) => <TestStatusBadge status={getValue()} />,
    meta: {
      treeSelect: {
        "data-cy": "status-treeselect",
        options: testStatusesFilterTreeData,
      },
    },
  },
  {
    header: () => (
      <>{task.versionMetadata.isPatch ? "Base" : "Previous"} Status</>
    ),
    accessorKey: "baseStatus",
    id: TestSortCategory.BaseStatus,
    enableSorting: true,
    cell: ({ getValue }) => {
      const status = getValue();
      return status && <TestStatusBadge status={status} />;
    },
  },
  {
    header: "Time",
    accessorKey: "duration",
    id: TestSortCategory.Duration,
    enableSorting: true,
    cell: ({ getValue }): string => {
      const ms = getValue() * 1000;
      return msToDuration(Math.trunc(ms));
    },
  },
  {
    header: "Logs",
    sorter: false,
    cell: ({ row }) => <LogsColumn testResult={row.original} task={task} />,
  },
];
