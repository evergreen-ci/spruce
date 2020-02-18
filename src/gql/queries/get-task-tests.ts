import gql from "graphql-tag";

export const GET_TASK_TESTS = gql`
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
      logs {
        url
      }
    }
  }
`;

export enum TestStatus {
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

export type SortDir = "ASC" | "DESC";

export interface TakskTestsVars {
  id: string;
  dir: SortDir;
  cat: Categories;
  pageNum: number;
  limitNum: number;
}

export interface UpdateQueryArg {
  taskTests: [TaskTestsData];
}
