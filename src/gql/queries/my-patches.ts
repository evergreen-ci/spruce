import gql from "graphql-tag";

export const GET_USER_PATCHES = gql`
  query userPatches(
    $page: Int
    $limit: Int
    $statuses: [String!]!
    $patchName: String
    $includeCommitQueue: Boolean
  ) {
    userPatches(
      page: $page
      limit: $limit
      statuses: $statuses
      patchName: $patchName
      includeCommitQueue: $includeCommitQueue
    ) {
      projectID
      description
      status
      createTime
      builds {
        id
        buildVariant
        status
        predictedMakespan
        actualMakespan
      }
    }
  }
`;

export interface Build {
  id: string;
  buildVariant: string;
  status: string;
  predictedMakespan: number;
  actualMakespan: number;
}
export interface UserPatchesVars {
  $page: number;
  $limit: number;
  $statuses: string[];
  $patchName: string;
  $includeCommitQueue: boolean;
}
export interface Patch {
  projectID: string;
  description: string;
  status: string;
  createTime: string;
  builds: Build[];
}
export interface UserPatchesData {
  userPatches: Patch[];
}
