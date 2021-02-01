import { gql } from "@apollo/client";
import { CodeChangesTable } from "gql/fragments/codeChangesTable";

/* eslint-disable */
export const GET_COMMIT_QUEUE = gql`
  query CommitQueue($id: String!) {
    commitQueue(id: $id) {
      projectId
      message
      owner
      repo
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
              ...CodeChangesTableFileDiffs
            }
          }
        }
      }
    }
  }
  ${CodeChangesTable.fragments.fileDiffs}
`;
