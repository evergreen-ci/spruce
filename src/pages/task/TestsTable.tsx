import React, { useEffect, useState } from "react";
import { TestsTableCore } from "./testsTable/TestsTableCore";
import { useLocation, useHistory } from "react-router-dom";
import { StatusSelector } from "./testsTable/StatusSelector";
import { Input } from "antd";
import Icon from "@leafygreen-ui/icon";
import {
  RequiredQueryParams,
  SortQueryParam,
  ValidInitialQueryParams,
  TestStatus
} from "types/task";
import { Categories } from "gql/queries/get-task-tests";
import queryString from "query-string";
import styled from "@emotion/styled";

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
  const parsed = queryString.parse(search, { arrayFormat: "comma" });
  const testName = (parsed[RequiredQueryParams.TestName] || "").toString();

  useEffect(() => {
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
      const statuses = parsed[RequiredQueryParams.Statuses];
      setValidInitialQueryParams({
        initialCategory: (
          parsed[RequiredQueryParams.Category] || ""
        ).toString(),
        initialSort: parsed[RequiredQueryParams.Sort],
        initialStatuses: (Array.isArray(statuses)
          ? statuses
          : [statuses]
        ).filter(v => v && v !== TestStatus.All),
        initialTestName: testName
      });
    }
  }, [search, pathname, replace, validInitialQueryParams, parsed, testName]);

  if (!validInitialQueryParams) {
    return null;
  }

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    parsed[RequiredQueryParams.TestName] = e.target.value;
    const nextQueryParams = queryString.stringify(parsed);
    replace(`${pathname}?${nextQueryParams}`);
  };

  return (
    <>
      <FiltersWrapper>
        <StyledInput
          placeholder="Search Test Names"
          onChange={onSearch}
          suffix={<Icon glyph="MagnifyingGlass" />}
          value={testName}
        />
        <StatusSelector />
      </FiltersWrapper>
      <TestsTableCore {...validInitialQueryParams} />
    </>
  );
};

const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;
const StyledInput = styled(Input)`
  max-width: 500px;
  margin-right: 40px;
`;
