import { MockedProvider } from "@apollo/client/testing";
import { StoryObj } from "@storybook/react";
import { ExecutionTasksTable } from "./ExecutionTasksTable";

export default {
  title: "Pages/Task/Table/Execution Tasks Table",
  component: ExecutionTasksTable,
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider>
        <Story />
      </MockedProvider>
    ),
  ],
};

export const SingleExecution: StoryObj<typeof ExecutionTasksTable> = {
  render: () => (
    <ExecutionTasksTable executionTasksFull={singleExecution} execution={5} />
  ),
};

export const MultipleExecutions: StoryObj<typeof ExecutionTasksTable> = {
  render: () => (
    <ExecutionTasksTable
      executionTasksFull={multipleExecutions}
      execution={14}
    />
  ),
};

const singleExecution = [
  {
    execution: 5,
    baseStatus: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Some fancy execution task",
    id: "some_id_5",
    status: "success",
  },
  {
    execution: 5,
    baseStatus: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Another execution task",
    id: "some_id_6",
    status: "success",
  },
];

const multipleExecutions = [
  {
    execution: 14,
    baseStatus: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Some fancy execution task",
    id: "some_id_5",
    status: "success",
  },
  {
    execution: 12,
    baseStatus: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Another execution task",
    id: "some_id_6",
    status: "success",
  },
];
