import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import { RequiredQueryParams } from "types/task";
import { TestStatus } from "types/task";
import { TreeSelect } from "components/TreeSelect";

export const StatusSelector = () => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();
  const value = useStatuses(search);

  const onChange = (updatedValue: [string]) => {
    if (
      !hasAllVal(value) &&
      (hasAllVal(updatedValue) || hasAllStatuses(updatedValue))
    ) {
      // user checks All box
      writeStatusesToURL({ replace, pathname, search, value: COMPLETE });
    } else if (
      hasAllVal(value) &&
      (!hasAllVal(updatedValue) || hasNoStatuses(updatedValue))
    ) {
      // user deselects All or all options aside from All are unchecked
      writeStatusesToURL({ replace, pathname, search, value: EMPTY });
    } else {
      // user selects some statuses but not all of them
      writeStatusesToURL({
        replace,
        pathname,
        search,
        value: updatedValue.filter(v => v != TestStatus.All)
      });
    }
  };

  const optionsLabel = value.includes(TestStatus.All)
    ? statusCopy[TestStatus.All]
    : value.map(status => statusCopy[status] || "").join(", ");

  return (
    <TreeSelect
      onChange={onChange}
      state={value}
      tData={treeData}
      inputLabel="Test Status:  "
      optionsLabel={optionsLabel || "No filters selected"}
      id="cy-test-status-select"
    />
  );
};

const arrayFormat = "comma";

const COMPLETE = [
  TestStatus.Pass,
  TestStatus.Fail,
  TestStatus.Skip,
  TestStatus.SilentFail,
  TestStatus.All
];

const statusCopy = {
  [TestStatus.Pass]: "Pass",
  [TestStatus.Fail]: "Fail",
  [TestStatus.Skip]: "Skip",
  [TestStatus.SilentFail]: "Silent Fail",
  [TestStatus.All]: "All"
};

const EMPTY: string[] = [];

// means "all" is checked
const hasAllVal = (statuses: string[]): boolean =>
  statuses && statuses.includes(TestStatus.All);

const hasAllStatuses = (statuses: string[]): boolean =>
  statuses &&
  statuses.includes(TestStatus.SilentFail) &&
  statuses.includes(TestStatus.Skip) &&
  statuses.includes(TestStatus.Pass) &&
  statuses.includes(TestStatus.Fail);

const hasNoStatuses = (statuses: string[]): boolean =>
  !statuses ||
  (!statuses.includes(TestStatus.SilentFail) &&
    !statuses.includes(TestStatus.Skip) &&
    !statuses.includes(TestStatus.Pass) &&
    !statuses.includes(TestStatus.Fail));

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
    title: "Failed",
    value: TestStatus.Fail,
    key: "failed"
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

const useStatuses = (search: string) => {
  const parsed = queryString.parse(search, { arrayFormat });
  const statuses = parsed[RequiredQueryParams.Statuses];
  return Array.isArray(statuses) ? statuses : [statuses].filter(v => v);
};

const writeStatusesToURL = ({
  pathname,
  replace,
  search,
  value
}: {
  pathname: string;
  replace: (path: string) => void;
  search: string;
  value: string[];
}) => {
  const parsed = queryString.parse(search, { arrayFormat });
  parsed[RequiredQueryParams.Statuses] = value;
  const nextQueryParams = queryString.stringify(parsed, { arrayFormat });
  replace(`${pathname}?${nextQueryParams}`);
};
