import gql from "graphql-tag";

export const SCHEDULE_TASK = gql`
  mutation ScheduleTask($taskId: String!) {
    scheduleTask(taskId: $taskId) {
      id
    }
  }
`;
