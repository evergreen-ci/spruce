import gql from "graphql-tag";

interface FileDiff {
  fileName: String;
  additions: Number;
  deletions: Number;
  diffLink: String;
}

interface ModuleCodeChange {
  branchName: String;
  htmlLink: String;
  rawLink: String;
  fileDiffs: FileDiff[];
}

export interface Patch {
  moduleCodeChanges: ModuleCodeChange[];
}

export interface GetCodeChangesQuery {
  patch: Patch;
}

export const GET_CODE_CHANGES = gql`
  query Patch($id: String!) {
    patch(id: $id) {
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
