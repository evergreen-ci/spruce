import { gql } from "@apollo/client";

export const GET_TASK_TESTS = gql`
  query TaskTests(
    $dir: SortDirection
    $id: String!
    $cat: TestSortCategory
    $pageNum: Int
    $limitNum: Int
    $statusList: [String!]!
    $testName: String!
    $execution: Int
  ) {
    taskTests(
      taskId: $id
      sortCategory: $cat
      sortDirection: $dir
      page: $pageNum
      limit: $limitNum
      statuses: $statusList
      testName: $testName
      execution: $execution
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
