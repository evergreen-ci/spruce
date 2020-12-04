import { gql } from "@apollo/client";

export const GET_PROJECT_PATCHES = gql`
  query ProjectPatches($projectId: String!, $patchesInput: PatchesInput!) {
    project(projectId: $projectId) {
      id
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
