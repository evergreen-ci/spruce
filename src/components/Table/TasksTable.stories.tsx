import { TasksTable } from "./TasksTable";

const tasks = [
  {
    id: "some_id",
    aborted: false,
    displayName: "Some Fancy ID",
    version: "123",
    status: "started",
    buildVariant: "ubuntu1604",
    buildVariantDisplayName: "Ubuntu 16.04",
    blocked: false,
    baseTask: {
      status: "unscheduled",
    },
    execution: 5,
  },
  {
    id: "some_id_2",
    aborted: false,
    displayName: "Some other Fancy ID",
    version: "123",
    status: "success",
    buildVariant: "ubuntu1604",
    buildVariantDisplayName: "Ubuntu 16.04",
    blocked: false,
    baseTask: {
      status: "failed",
    },
    execution: 4,
  },
  {
    id: "some_id_3",
    aborted: false,
    displayName: "Some different Fancy ID",
    version: "234",
    status: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    blocked: false,
    baseTask: {
      status: "failed",
    },
    execution: 0,
  },
];

const nestedTasks = [
  ...tasks,
  {
    id: "some_id_4",
    aborted: false,
    displayName: "Some Fancy Display Task",
    version: "234",
    status: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    blocked: false,
    baseTask: {
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
          status: "aborted",
        },
      },
      {
        id: "some_id_6",
        aborted: false,
        displayName: "Another execution task",
        version: "234",
        status: "success",
        buildVariant: "Windows",
        buildVariantDisplayName: "Windows 97",
        blocked: false,
        baseTask: {
          status: "system-failed",
        },
      },
    ],
  },
];
export const BaseTaskTable = () => <TasksTable tasks={tasks} />;
export const ExecutionTasksTable = () => (
  <TasksTable tasks={nestedTasks} showTaskExecutionLabel={true} />
);
export default {
  title: "Components/Tasks Table",
  component: TasksTable,
};
