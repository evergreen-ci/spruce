import { CustomStoryObj, CustomMeta } from "test_utils/types";

import TasksTable from ".";

export default {
  component: TasksTable,
} satisfies CustomMeta<typeof TasksTable>;

export const BaseTaskTable: CustomStoryObj<typeof TasksTable> = {
  render: () => <TasksTable isPatch tasks={tasks} />,
};

export const ExecutionTasksTable: CustomStoryObj<typeof TasksTable> = {
  render: () => <TasksTable isPatch tasks={nestedTasks} />,
};

export const VersionTasksTable: CustomStoryObj<typeof TasksTable> = {
  render: () => <TasksTable isPatch={false} tasks={tasks} />,
};

const tasks = [
  {
    aborted: false,
    baseTask: {
      status: "unscheduled",
    },
    blocked: false,
    buildVariant: "ubuntu1604",
    buildVariantDisplayName: "Ubuntu 16.04",
    displayName: "Some Fancy ID",
    id: "some_id",
    status: "started",
    version: "123",
  },
  {
    aborted: false,
    baseTask: {
      status: "failed",
    },
    blocked: false,
    buildVariant: "ubuntu1604",
    buildVariantDisplayName: "Ubuntu 16.04",
    displayName: "Some other Fancy ID",
    id: "some_id_2",
    status: "success",
    version: "123",
  },
  {
    aborted: false,
    baseTask: {
      status: "failed",
    },
    blocked: false,
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Some different Fancy ID",
    id: "some_id_3",
    status: "success",
    version: "234",
  },
];

const nestedTasks = [
  ...tasks,
  {
    aborted: false,
    baseTask: {
      status: "failed",
    },
    blocked: false,
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Some Fancy Display Task",
    executionTasksFull: [
      {
        aborted: false,
        baseTask: {
          status: "aborted",
        },
        blocked: false,
        buildVariant: "Windows",
        buildVariantDisplayName: "Windows 97",
        displayName: "Some fancy execution task",
        id: "some_id_5",
        status: "success",
        version: "234",
      },
      {
        aborted: false,
        baseTask: {
          status: "system-failed",
        },
        blocked: false,
        buildVariant: "Windows",
        buildVariantDisplayName: "Windows 97",
        displayName: "Another execution task",
        id: "some_id_6",
        status: "success",
        version: "234",
      },
    ],
    id: "some_id_4",
    status: "success",
    version: "234",
  },
];
