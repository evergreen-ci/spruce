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
    id: "some_id",
    projectIdentifier: "evg",
    execution: 0,
    aborted: false,
    displayName: "Some Fancy ID",
    version: "123",
    status: "started",
    buildVariant: "ubuntu1604",
    buildVariantDisplayName: "Ubuntu 16.04",
    blocked: false,
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
    aborted: false,
    displayName: "Some other Fancy ID",
    version: "123",
    status: "success",
    buildVariant: "ubuntu1604",
    buildVariantDisplayName: "Ubuntu 16.04",
    blocked: false,
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
    aborted: false,
    displayName: "Some different Fancy ID",
    version: "234",
    status: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    blocked: false,
    baseTask: {
      id: "some_base_task_3",
      execution: 0,
      status: "failed",
    },
    executionTasksFull: [],
    dependsOn: [],
  },
];

const nestedTasks = [
  ...tasks,
  {
    id: "some_id_4",
    projectIdentifier: "evg",
    execution: 0,
    aborted: false,
    displayName: "Some Fancy Display Task",
    version: "234",
    status: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    blocked: false,
    baseTask: {
      id: "some_base_task_4",
      execution: 0,
      status: "failed",
    },
    executionTasksFull: [
      {
        id: "some_id_5",
        aborted: false,
        displayName: "Some fancy execution task",
        version: "234",
        status: "success",
        buildVariant: "Windows",
        buildVariantDisplayName: "Windows 97",
        blocked: false,
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
        aborted: false,
        displayName: "Another execution task",
        version: "234",
        status: "success",
        buildVariant: "Windows",
        buildVariantDisplayName: "Windows 97",
        blocked: false,
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
