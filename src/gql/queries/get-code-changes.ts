import gql from "graphql-tag";
import { Patch } from "types/patch";

export interface GetCodeChangesQuery {
  patch: Patch;
}

export const GET_CODE_CHANGES = gql`
  query Patch($id: String!) {
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
        }
      }
    }
  }
`;
