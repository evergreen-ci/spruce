export interface ValidInitialQueryParams {
  initialCategory: string | string[];
  initialSort: string | string[];
}

export enum Categories {
  TestName = "TEST_NAME",
  Duration = "DURATION",
  Status = "STATUS"
}

export enum RequiredQueryParams {
  Sort = "sort",
  Category = "category",
  Page = "page",
  Limit = "limit"
}

export enum Sort {
  Desc = "-1",
  Asc = "1"
}

export enum TestStatus {
  Failed = "fail",
  SilentlyFailed = "silentfail",
  Skipped = "skip",
  Succeeded = "pass"
}
