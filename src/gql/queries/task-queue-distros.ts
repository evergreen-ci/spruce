import gql from "graphql-tag";

export const TASK_QUEUE_DISTROS = gql`
  query TaskQueueDistros {
    taskQueueDistros {
      id
      queueCount
    }
  }
`;
