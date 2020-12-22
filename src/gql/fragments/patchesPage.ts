import { gql } from "@apollo/client";

/* eslint-disable */
export const PatchesPage = {
  fragments: {
    patches: gql`
      fragment PatchesPagePatches on Patches {
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
    `,
  },
};
