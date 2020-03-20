import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import { RequiredQueryParams } from "types/task";
import { TestStatus } from "types/task";
import { TreeSelect } from "components/TreeSelect";

export const StatusSelector = () => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();
  const value = useQueryParamStatuses(search);

  const onChange = (updatedValue: [string]) => {
    const parsed = queryString.parse(search, { arrayFormat });
    parsed[RequiredQueryParams.Statuses] = updatedValue;
    const nextQueryParams = queryString.stringify(parsed, { arrayFormat });
    replace(`${pathname}?${nextQueryParams}`);
  };

  return (
    <TreeSelect
      onChange={onChange}
      state={value}
      tData={treeData}
      inputLabel="Test Status:  "
      id="cy-test-status-select"
    />
  );
};

const arrayFormat = "comma";

const treeData = [
  {
    title: "All",
    value: TestStatus.All,
    key: TestStatus.All
  },
  {
    title: "Pass",
    value: TestStatus.Pass,
    key: TestStatus.Pass
  },
  {
    title: "Fail",
    value: TestStatus.Fail,
    key: TestStatus.Fail
  },
  {
    title: "Skip",
    value: TestStatus.Skip,
    key: TestStatus.Skip
  },
  {
    title: "Silent Fail",
    value: TestStatus.SilentFail,
    key: TestStatus.SilentFail
  }
];

const useQueryParamStatuses = (search: string) => {
  const parsed = queryString.parse(search, { arrayFormat });
  const statuses = parsed[RequiredQueryParams.Statuses];
  return Array.isArray(statuses) ? statuses : [statuses].filter(v => v);
};
