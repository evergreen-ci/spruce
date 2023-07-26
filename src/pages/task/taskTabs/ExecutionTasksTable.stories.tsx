import { CustomStoryObj, CustomMeta } from "test_utils/types";

import { ExecutionTasksTable } from "./ExecutionTasksTable";

export default {
  component: ExecutionTasksTable,
  title: "Pages/Task/Table/Execution Tasks Table",
} satisfies CustomMeta<typeof ExecutionTasksTable>;

export const SingleExecution: CustomStoryObj<typeof ExecutionTasksTable> = {
  render: () => (
    <ExecutionTasksTable
      isPatch
      executionTasksFull={singleExecution}
      execution={5}
    />
  ),
};

export const MultipleExecutions: CustomStoryObj<typeof ExecutionTasksTable> = {
  render: () => (
    <ExecutionTasksTable
      isPatch
      executionTasksFull={multipleExecutions}
      execution={14}
    />
  ),
};

const singleExecution = [
  {
    baseStatus: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Some fancy execution task",
    execution: 5,
    id: "some_id_5",
    status: "success",
  },
  {
    baseStatus: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Another execution task",
    execution: 5,
    id: "some_id_6",
    status: "success",
  },
];

const multipleExecutions = [
  {
    baseStatus: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Some fancy execution task",
    execution: 14,
    id: "some_id_5",
    status: "success",
  },
  {
    baseStatus: "success",
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    displayName: "Another execution task",
    execution: 12,
    id: "some_id_6",
    status: "success",
  },
];
