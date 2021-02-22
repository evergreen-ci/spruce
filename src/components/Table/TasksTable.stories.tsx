import { withQuery } from "@storybook/addon-queryparams";
import { MemoryRouter } from "react-router-dom";
import { TaskResult } from "gql/generated/types";
import { TasksTable } from "./TasksTable";

const tasks: TaskResult[] = [
  {
    id: "some_id",
    aborted: false,
    displayName: "Some Fancy ID",
    version: "123",
    status: "success",
    buildVariant: "ubuntu1604",
    buildVariantDisplayName: "Ubuntu 16.04",
    blocked: false,
    baseStatus: "failed",
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
    baseStatus: "failed",
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
    baseStatus: "failed",
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
    baseStatus: "failed",
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
        baseStatus: "failed",
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
        baseStatus: "failed",
      },
    ],
  },
];
export const BaseTaskTable = () => <TasksTable tasks={tasks} />;
export const ExecutionTasksTable = () => <TasksTable tasks={nestedTasks} />;
export default {
  title: "Tasks Table",
  component: TasksTable,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
    withQuery,
  ],
};
