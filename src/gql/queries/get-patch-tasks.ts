import { gql } from "@apollo/client";

export const GET_PATCH_TASKS = gql`
  query PatchTasks(
    $patchId: String!
    $sortBy: TaskSortCategory
    $sortDir: SortDirection
    $page: Int
    $statuses: [String!]
    $baseStatuses: [String!]
    $variant: String
    $taskName: String
    $limit: Int
  ) {
    patchTasks(
      patchId: $patchId
      limit: $limit
      page: $page
      statuses: $statuses
      baseStatuses: $baseStatuses
      sortDir: $sortDir
      sortBy: $sortBy
      variant: $variant
      taskName: $taskName
    ) {
      count
      tasks {
        id
        aborted
        status
        baseStatus
        displayName
        buildVariant
        blocked
      }
    }
  }
`;
