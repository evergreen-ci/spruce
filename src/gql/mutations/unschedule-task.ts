import gql from "graphql-tag";

export const UNSCHEDULE_TASK = gql`
  mutation UnscheduleTask($taskId: String!) {
    unscheduleTask(taskId: $taskId) {
      id
    }
  }
`;
