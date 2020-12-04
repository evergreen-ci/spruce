import { gql } from "@apollo/client";

export const GET_USER_PATCHES = gql`
  query UserPatches($userId: String!, $patchesInput: PatchesInput!) {
    user(userId: $userId) {
      userId
      patches(patchesInput: $patchesInput) {
        patches {
          id
          projectID
          description
          status
          createTime
          commitQueuePosition
          builds {
            id
            buildVariant
            status
          }
          canEnqueueToCommitQueue
        }
        filteredPatchCount
      }
    }
  }
`;
