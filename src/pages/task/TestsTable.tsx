import React, { useEffect } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import queryString from "query-string";
import gql from "graphql-tag";

const TESTS_QUERY = gql`
  query GetStuff($dir: SortDirection, $id: String!, $cat: TaskSortCategory) {
    taskTests(taskId: $id, sortCategory: $cat, sortDirection: $dir) {
      id
      status
      testFile
      duration
    }
  }
`;

enum RequiredQueryParams {
  Sort = "sort",
  Category = "category",
  Page = "page",
  Limit = "limit"
}

enum Categories {
  TestName = "TEST_NAME",
  Duration = "DURATION",
  Status = "STATUS"
}

enum Sort {
  Desc = "-1",
  Asc = "1"
}

enum DefaultQueryParams {
  Sort = "1",
  Category = "TEST_NAME",
  Page = "0",
  Limit = "0"
}

export const TestsTable: React.FC = () => {
  const { pathname, search } = useLocation();
  const { taskID } = useParams();
  const { replace } = useHistory();

  const { loading, error, data } = useQuery(TESTS_QUERY, {
    variables: {
      id: taskID
    }
  });

  console.log(loading, error, data);
  useEffect(() => {
    const parsed = queryString.parse(search);
    const category = (
      JSON.stringify(parsed[RequiredQueryParams.Category]) || ""
    ).toUpperCase();
    const limitNum = parseInt(
      JSON.stringify(parsed[RequiredQueryParams.Limit])
    );
    const pageNum = parseInt(JSON.stringify(parsed[RequiredQueryParams.Page]));
    const sort = parsed[RequiredQueryParams.Sort];
    if (
      (sort !== Sort.Desc && sort !== Sort.Asc) ||
      (category !== Categories.TestName &&
        category !== Categories.Duration &&
        category !== Categories.Status) ||
      !Number.isInteger(pageNum) ||
      pageNum < 0 ||
      !Number.isInteger(limitNum) ||
      limitNum < 0
    ) {
      parsed[RequiredQueryParams.Category] = DefaultQueryParams.Category;
      parsed[RequiredQueryParams.Sort] = DefaultQueryParams.Sort;
      parsed[RequiredQueryParams.Page] = DefaultQueryParams.Page;
      parsed[RequiredQueryParams.Limit] = DefaultQueryParams.Limit;
      const nextQueryParams = queryString.stringify(parsed);
      replace(`${pathname}?${nextQueryParams}`);
    }
  }, [search, pathname, replace]);

  return <div>Test table</div>;
};
