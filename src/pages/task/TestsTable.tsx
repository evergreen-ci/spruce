import React, { useEffect, useState } from "react";
import { TestsTableCore } from "pages/task/TestsTableCore";
import { useLocation, useHistory } from "react-router-dom";
import {
  Categories,
  RequiredQueryParams,
  Sort,
  ValidInitialQueryParams,
  Limit
} from "pages/task/types";
import queryString from "query-string";

enum DefaultQueryParams {
  Sort = "1",
  Category = "TEST_NAME",
  Page = "0",
  Limit = "0"
}

export const TestsTable: React.FC<Limit> = ({ limit }) => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();
  const [validInitialQueryParams, setValidInitialQueryParams] = useState<
    ValidInitialQueryParams
  >();

  useEffect(() => {
    const parsed = queryString.parse(search);
    const category = (parsed[RequiredQueryParams.Category] || "")
      .toString()
      .toUpperCase();
    const sort = parsed[RequiredQueryParams.Sort];
    if (
      (sort !== Sort.Desc && sort !== Sort.Asc) ||
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
  return <TestsTableCore {...validInitialQueryParams} limit={limit} />;
};
