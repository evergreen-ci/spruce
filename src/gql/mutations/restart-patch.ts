import { gql } from "@apollo/client";

export const RESTART_PATCH = gql`
  mutation RestartPatch(
    $patchId: String!
    $abort: Boolean!
    $taskIds: [String!]!
  ) {
    restartPatch(patchId: $patchId, abort: $abort, taskIds: $taskIds)
  }
`;
