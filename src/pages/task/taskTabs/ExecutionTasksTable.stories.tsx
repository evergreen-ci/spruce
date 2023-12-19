import { CustomStoryObj, CustomMeta } from "test_utils/types";

import { ExecutionTasksTable } from "./ExecutionTasksTable";

export default {
  component: ExecutionTasksTable,
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
