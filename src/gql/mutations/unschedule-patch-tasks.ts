import gql from "graphql-tag";

export const UNSCHEDULE_PATCH_TASKS = gql`
  mutation UnschedulePatchTasks($patchId: String!, $abort: Boolean!) {
    unschedulePatchTasks(patchId: $patchId, abort: $abort)
  }
`;
