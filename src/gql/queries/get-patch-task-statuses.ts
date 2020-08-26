import { gql } from "@apollo/client";

export const GET_PATCH_TASK_STATUSES = gql`
  query GetPatchTaskStatuses($id: String!) {
    patch(id: $id) {
      id
      taskStatuses
      baseTaskStatuses
    }
  }
`;
