import React, { useEffect, useState } from "react";
import { TestsTableCore } from "pages/task/testsTable/TestsTableCore";
import { useLocation, useHistory } from "react-router-dom";
import {
  RequiredQueryParams,
  SortQueryParam,
  ValidInitialQueryParams
} from "pages/types/task";
import { Categories } from "gql/queries/get-task-tests";
import queryString from "query-string";

enum DefaultQueryParams {
  Sort = "1",
  Category = "TEST_NAME"
}

export const TestsTable: React.FC = () => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();
  const [validInitialQueryParams, setValidInitialQueryParams] = useState<
    ValidInitialQueryParams
  >();

  // validate query params for tests table and replace them if necessary
  useEffect(() => {
    const parsed = queryString.parse(search);
    const category = (parsed[RequiredQueryParams.Category] || "")
      .toString()
      .toUpperCase();
    const sort = parsed[RequiredQueryParams.Sort];
    if (
      (sort !== SortQueryParam.Desc && sort !== SortQueryParam.Asc) ||
      (category !== Categories.TestName &&
        category !== Categories.Duration &&
        category !== Categories.Status)
    ) {
      parsed[RequiredQueryParams.Category] = DefaultQueryParams.Category;
      parsed[RequiredQueryParams.Sort] = DefaultQueryParams.Sort;
      const nextQueryParams = queryString.stringify(parsed);
      replace(`${pathname}?${nextQueryParams}`);
    } else if (!validInitialQueryParams) {
      setValidInitialQueryParams({
        initialCategory: parsed[RequiredQueryParams.Category],
        initialSort: parsed[RequiredQueryParams.Sort]
      });
    }
  }, [search, pathname, replace, validInitialQueryParams]);

  if (!validInitialQueryParams) {
    return null;
  }
  return <TestsTableCore {...validInitialQueryParams} />;
};
