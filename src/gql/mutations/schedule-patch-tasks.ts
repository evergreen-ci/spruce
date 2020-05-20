import gql from "graphql-tag";

export const SCHEDULE_PATCH_TASKS = gql`
  mutation SchedulePatchTasks($patchId: String!) {
    schedulePatchTasks(patchId: $patchId)
  }
`;
