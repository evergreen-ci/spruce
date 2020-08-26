import { gql } from "@apollo/client";

export const UNSCHEDULE_TASK = gql`
  mutation UnscheduleTask($taskId: String!) {
    unscheduleTask(taskId: $taskId) {
      id
    }
  }
`;
