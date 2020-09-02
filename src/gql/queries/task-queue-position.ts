import { gql } from "@apollo/client";

export const TASK_QUEUE_POSITION = gql`
  query TaskQueuePosition($taskId: String!) {
    task(taskId: $taskId) {
      minQueuePosition
    }
  }
`;
