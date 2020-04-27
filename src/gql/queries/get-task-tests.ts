import gql from "graphql-tag";

export const GET_TASK_TESTS = gql`
  query taskTests(
    $dir: SortDirection
    $id: String!
    $cat: TestSortCategory
    $pageNum: Int
    $limitNum: Int
    $statusList: [String!]!
    $testName: String!
  ) {
    taskTests(
      taskId: $id
      sortCategory: $cat
      sortDirection: $dir
      page: $pageNum
      limit: $limitNum
      statuses: $statusList
      testName: $testName
    ) {
      testResults {
        id
        status
        testFile
        duration
        logs {
          htmlDisplayURL
          rawDisplayURL
        }
      }
      filteredTestCount
      totalTestCount
    }
  }
`;
