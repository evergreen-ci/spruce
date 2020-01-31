import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import { TestsTableCore } from "pages/task/TestsTableCore";
import { Categories, RequiredQueryParams, Sort } from "utils/enums";

enum DefaultQueryParams {
  Sort = "1",
  Category = "TEST_NAME",
  Page = "0",
  Limit = "0"
}

export const TestsTable: React.FC = () => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();
  const [isSet, setIsSet] = useState();

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
    } else if (!isSet) {
      setIsSet({
        initialCategory: parsed[RequiredQueryParams.Category],
        initialSort: parsed[RequiredQueryParams.Sort]
      });
    }
  }, [search, pathname, replace]);
  if (!isSet) return null;
  return <TestsTableCore {...isSet} />;
};
