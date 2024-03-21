import { useMemo, useRef } from "react";
import { useLeafyGreenTable } from "@leafygreen-ui/table";
import { BaseTable } from "components/Table/BaseTable";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { TaskStatus } from "types/task";
import { getColumnsTemplate } from "./Columns";
import { TaskTableInfo } from "./types";

export default {
  component: BaseTable,
} satisfies CustomMeta<typeof BaseTable>;

const TasksTableStory = (args: any) => {
  const columns = useMemo(
    () => getColumnsTemplate({ statusOptions, baseStatusOptions }),
    [],
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<TaskTableInfo>({
    columns,
    containerRef: tableContainerRef,
    data: tasks ?? [],
    defaultColumn: {
      enableColumnFilter: true,
      enableSorting: true,
    },
    getSubRows: (row) => row.executionTasksFull || [],
  });

  return (
    <BaseTable
      table={table}
      disableAnimations={args.disableAnimations}
      shouldAlternateRowColor
    />
  );
};

export const Default: CustomStoryObj<any> = {
  args: {
    disableAnimations: true,
  },
  render: (args) => <TasksTableStory {...args} />,
};

const statusOptions = [
  {
    title: "All",
    key: "all",
    value: "all",
  },
  {
    title: "Running",
    key: TaskStatus.Started,
    value: TaskStatus.Started,
  },
  {
    title: "Succeeded",
    key: TaskStatus.Succeeded,
    value: TaskStatus.Succeeded,
  },
];

const baseStatusOptions = [
  {
    title: "All",
    key: "all",
    value: "all",
  },
  {
    title: "Unscheduled",
    key: TaskStatus.Unscheduled,
    value: TaskStatus.Unscheduled,
  },
  {
    title: "Failed",
    key: TaskStatus.Failed,
    value: TaskStatus.Failed,
  },
];

const tasks: TaskTableInfo[] = [
  {
    id: "some_id",
    projectIdentifier: "evg",
    execution: 0,
    displayName: "Some Fancy ID",
    status: "started",
    buildVariant: "ubuntu1604",
    buildVariantDisplayName: "Ubuntu 16.04",
    baseTask: {
      id: "some_base_task",
      execution: 0,
      status: "unscheduled",
    },
    executionTasksFull: [],
    dependsOn: [],
  },
  {
    id: "some_id_2",
    projectIdentifier: "evg",
    execution: 0,
    displayName: "Some other Fancy ID",
    status: "success",
    buildVariant: "ubuntu1604",
    buildVariantDisplayName: "Ubuntu 16.04",
    baseTask: {
      id: "some_base_task_2",
      execution: 0,
      status: "failed",
    },
    executionTasksFull: [],
    dependsOn: [],
  },
  {
    id: "some_id_3",
    projectIdentifier: "evg",
    execution: 0,
    displayName: "Some different Fancy ID",
    status: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    baseTask: {
      id: "some_base_task_3",
      execution: 0,
      status: "failed",
    },
    executionTasksFull: [],
    dependsOn: [],
  },
  {
    id: "some_id_4",
    projectIdentifier: "evg",
    execution: 0,
    displayName: "Some Fancy Display Task",
    status: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    baseTask: {
      id: "some_base_task_4",
      execution: 0,
      status: "failed",
    },
    executionTasksFull: [
      {
        id: "some_id_5",
        execution: 0,
        displayName: "Some fancy execution task",
        status: "success",
        buildVariant: "Windows",
        buildVariantDisplayName: "Windows 97",
        baseTask: {
          id: "some_base_task_5",
          execution: 0,
          status: "aborted",
        },
      },
      {
        id: "some_id_6",
        projectIdentifier: "evg",
        execution: 0,
        displayName: "Another execution task",
        status: "success",
        buildVariant: "Windows",
        buildVariantDisplayName: "Windows 97",
        baseTask: {
          id: "some_base_task_6",
          execution: 0,
          status: "system-failed",
        },
      },
    ],
    dependsOn: [],
  },
];
