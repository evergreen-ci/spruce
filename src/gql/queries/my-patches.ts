import gql from "graphql-tag";

export const GET_USER_PATCHES = gql`
  query UserPatches(
    $page: Int
    $limit: Int
    $statuses: [String!]
    $patchName: String
    $includeCommitQueue: Boolean
    $userId: String
  ) {
    userPatches(
      page: $page
      limit: $limit
      statuses: $statuses
      patchName: $patchName
      userId: $userId
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
