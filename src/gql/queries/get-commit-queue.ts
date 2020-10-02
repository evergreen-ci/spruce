import { gql } from "@apollo/client";

export const GET_COMMIT_QUEUE = gql`
  query CommitQueue($id: String!) {
    commitQueue(id: $id) {
      projectId
      message
      queue {
        issue
        enqueueTime
        patch {
          id
          author
          description
          moduleCodeChanges {
            rawLink
            branchName
            htmlLink
            fileDiffs {
              fileName
              additions
              deletions
              diffLink
            }
          }
        }
      }
    }
  }
`;
