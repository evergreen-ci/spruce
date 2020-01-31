import gql from "graphql-tag";
export const TESTS_QUERY = gql`
  query taskTests(
    $dir: SortDirection
    $id: String!
    $cat: TaskSortCategory
    $pageNum: Int
    $limitNum: Int
  ) {
    taskTests(
      taskId: $id
      sortCategory: $cat
      sortDirection: $dir
      page: $pageNum
      limit: $limitNum
    ) {
      id
      status
      testFile
      duration
    }
  }
`;
