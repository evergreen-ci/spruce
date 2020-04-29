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
      patches {
        id
        projectID
        description
        status
        createTime
        builds {
          buildVariant
          status
        }
      }
      filteredPatchCount
    }
  }
`;

export const GET_PATCH_VARIANTS_AND_STATUS = gql`
  query patchBuildVariantsAndStatus($id: String!) {
    patch(id: $id) {
      status
      activated
      builds {
        buildVariant
        status
      }
    }
  }
`;

export interface Build {
  buildVariant: string;
  status: BuildStatus;
}

interface Patch {
  builds: Build[];
  status: PatchStatus;
  activated: boolean;
}

export interface PatchVariantsAndStatusData {
  patch: Patch;
}

export interface PatchVariantsAndStatusVars {
  id: string;
}

export interface UserPatchesVars {
  page: number;
  limit: number;
  statuses: string[];
  patchName: string;
  includeCommitQueue: boolean;
}

export interface UserPatch {
  id: string;
  projectID: string;
  description: string;
  status: PatchStatus;
  createTime: string;
  builds: Build[];
}

interface UserPatches {
  patches: UserPatch[];
  filteredPatchCount: number;
}

export interface UserPatchesData {
  userPatches: UserPatches;
}
