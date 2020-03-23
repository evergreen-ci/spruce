import gql from "graphql-tag";

export interface FileDiff {
  fileName: string;
  additions: number;
  deletions: number;
  diffLink: string;
}

interface ModuleCodeChange {
  branchName: string;
  htmlLink: string;
  rawLink: string;
  fileDiffs: FileDiff[];
}

export interface Patch {
  moduleCodeChanges: ModuleCodeChange[];
  id: string;
}

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
