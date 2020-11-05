import { gql } from "@apollo/client";

export const TASK_QUEUE_DISTROS = gql`
  query TaskQueueDistros {
    taskQueueDistros {
      id
      queueCount
    }
  }
`;
