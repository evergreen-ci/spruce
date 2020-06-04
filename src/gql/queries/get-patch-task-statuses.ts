import gql from "graphql-tag";

export const GET_PATCH_TASK_STATUSES = gql`
  query GetPatchTaskStatuses($id: String!) {
    patch(id: $id) {
      id
      taskStatuses
      baseTaskStatuses
    }
  }
`;
