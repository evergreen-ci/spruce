import { ExecutionTasksTable } from "./ExecutionTasksTable";

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
export const SingleExecution = () => (
  <ExecutionTasksTable executionTasksFull={singleExecution} execution={5} />
);
export const MultipleExecutions = () => (
  <ExecutionTasksTable executionTasksFull={multipleExecutions} execution={14} />
);
export default {
  title: "Components/Execution Tasks Table",
  component: ExecutionTasksTable,
};
