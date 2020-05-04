import gql from "graphql-tag";

export const GET_USER_PATCHES = gql`
  query UserPatches(
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
          id
          buildVariant
          status
        }
      }
      filteredPatchCount
    }
  }
`;

export const GET_PATCH_VARIANTS_AND_STATUS = gql`
  query PatchBuildVariantsAndStatus($id: String!) {
    patch(id: $id) {
      status
      builds {
        id
        buildVariant
        status
      }
    }
  }
`;
