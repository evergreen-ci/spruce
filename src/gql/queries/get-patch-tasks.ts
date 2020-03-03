import gql from "graphql-tag";

export const GET_PATCH_TASKS = gql`
  query PatchTasks($patchId: String!) {
    patchTasks(patchId: $patchId, limit: 25) {
      id
      status
      baseStatus
      displayName
      buildVariant
    }
  }
`;

export interface TaskResult {
  id: string;
  status: string;
  baseStatus: string;
  displayName: string;
  buildVariant: string;
}

export interface PatchTasksQuery {
  patchTasks: [TaskResult];
}
