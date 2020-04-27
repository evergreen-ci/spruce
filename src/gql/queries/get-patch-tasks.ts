import gql from "graphql-tag";

export const PATCH_TASKS_LIMIT = 10;
// When updating this limit be sure to update the limit field in the query

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
  ) {
    patchTasks(
      patchId: $patchId
      limit: 10
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
        status
        baseStatus
        displayName
        buildVariant
      }
    }
  }
`;
