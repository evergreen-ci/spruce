import { gql } from "@apollo/client";

export const SCHEDULE_TASK = gql`
  mutation ScheduleTask($taskId: String!) {
    scheduleTask(taskId: $taskId) {
      id
    }
  }
`;
