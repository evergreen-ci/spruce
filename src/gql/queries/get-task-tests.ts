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
      id
      status
      testFile
      duration
      logs {
        htmlDisplayURL
        rawDisplayURL
      }
    }
  }
`;

enum TestStatus {
  Failed = "fail",
  SilentlyFailed = "silentfail",
  Skipped = "skip",
  Succeeded = "pass"
}

export enum Categories {
  TestName = "TEST_NAME",
  Duration = "DURATION",
  Status = "STATUS"
}

export interface TaskTestsData {
  id: string;
  status: TestStatus;
  testFile: string;
  duration: number;
}

export enum SortDir {
  ASC = "ASC",
  DESC = "DESC"
}

export interface TaskTestVars {
  id: string;
  dir: SortDir;
  cat: Categories;
  pageNum: number;
  limitNum: number;
  statusList: string[];
  testName: string;
}

export interface UpdateQueryArg {
  taskTests: [TaskTestsData];
}
