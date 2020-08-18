import gql from "graphql-tag";

export const GET_TASK_ALL_EXECUTIONS = gql`
  query GetTaskAllExecutions($taskId: String!) {
    taskAllExecutions(taskId: $taskId) {
      execution
      status
      createTime
    }
  }
`;
