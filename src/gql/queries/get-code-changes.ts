import { gql } from "@apollo/client";

export const GET_CODE_CHANGES = gql`
  query CodeChanges($id: String!) {
    patch(id: $id) {
      id
      moduleCodeChanges {
        branchName
        htmlLink
        rawLink
        fileDiffs {
          fileName
          additions
          deletions
          diffLink
          description
        }
      }
    }
  }
`;
