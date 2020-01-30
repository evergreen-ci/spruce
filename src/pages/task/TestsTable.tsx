import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import queryString from "query-string";
import { Tag, Spin } from "antd";
import { TestsTableCore } from "pages/task/TestsTableCore";
import { Categories, RequiredQueryParams, Sort } from "utils/enums";

enum DefaultQueryParams {
  Sort = "1",
  Category = "TEST_NAME",
  Page = "0",
  Limit = "0"
}

interface TaskTests {
  id: String;
  status: String;
  testFile: String;
  duration: Number;
}

interface UpdateQueryParam {
  taskTests: [TaskTests];
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
        category: parsed[RequiredQueryParams.Category],
        sort: parsed[RequiredQueryParams.Sort]
      });
    }
  }, [search, pathname, replace]);
  if (!isSet) return null;
  return <TestsTableCore {...isSet} />;
};
