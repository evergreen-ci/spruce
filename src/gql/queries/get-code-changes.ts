import { gql } from "@apollo/client";
import { CodeChangesTable } from "gql/fragments/codeChangesTable";

/* eslint-disable */
export const GET_CODE_CHANGES = gql`
  query CodeChanges($id: String!) {
    patch(id: $id) {
      id
      moduleCodeChanges {
        branchName
        htmlLink
        rawLink
        fileDiffs {
          ...CodeChangesTableFileDiffs
        }
      }
    }
  }
  ${CodeChangesTable.fragments.fileDiffs}
`;
