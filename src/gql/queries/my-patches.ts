import gql from "graphql-tag";
import { PatchStatus } from "types/patch";
import { BuildStatus } from "types/build";

export const GET_USER_PATCHES = gql`
  query userPatches(
    $page: Int
    $limit: Int
    $statuses: [String!]
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
      id
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
  status: BuildStatus;
  predictedMakespan: number;
  actualMakespan: number;
}
export interface UserPatchesVars {
  page: number;
  limit: number;
  statuses: string[];
  patchName: string;
  includeCommitQueue: boolean;
}
export interface Patch {
  id: string;
  projectID: string;
  description: string;
  status: PatchStatus;
  createTime: string;
  builds: Build[];
}
export interface UserPatchesData {
  userPatches: Patch[];
}
