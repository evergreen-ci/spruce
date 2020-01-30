import gql from "graphql-tag";
export const TESTS_QUERY = gql`
  query GetStuff(
    $dir: SortDirection
    $id: String!
    $cat: TaskSortCategory
    $pageNum: Int
  ) {
    taskTests(
      taskId: $id
      sortCategory: $cat
      sortDirection: $dir
      page: $pageNum
      limit: 10
    ) {
      id
      status
      testFile
      duration
    }
  }
`;
