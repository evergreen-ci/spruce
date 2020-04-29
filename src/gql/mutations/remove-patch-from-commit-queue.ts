import gql from "graphql-tag";

export const REMOVE_PATCH_FROM_COMMIT_QUEUE = gql`
  mutation RemovePatchFromCommitQueue(
    $commitQueueId: String!
    $patchId: String!
  ) {
    removePatchFromCommitQueue(commitQueueId: $commitQueueId, patchId: $patchId)
  }
`;
