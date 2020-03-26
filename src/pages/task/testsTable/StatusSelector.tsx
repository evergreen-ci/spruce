import React from "react";
<<<<<<< HEAD
import { RequiredQueryParams } from "types/task";
import { TestStatus } from "types/task";
import { TreeSelect } from "components/TreeSelect";
import { useStatusesFilter } from "hooks";

export const StatusSelector = () => {
  const [statusVal, statusValOnChange] = useStatusesFilter(
    RequiredQueryParams.Statuses
  );
=======
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
>>>>>>> Revert "EVG-7524: task status dropdown updates url statuses param"

  return (
    <TreeSelect
      onChange={statusValOnChange}
      state={statusVal}
      tData={treeData}
      inputLabel="Test Status:  "
      dataCy="test-status-select"
      width="25%"
    />
  );
};

const arrayFormat = "comma";

const treeData = [
  {
    title: "All",
    value: TestStatus.All,
    key: TestStatus.All,
  },
  {
    title: "Pass",
    value: TestStatus.Pass,
    key: TestStatus.Pass,
  },
  {
    title: "Fail",
    value: TestStatus.Fail,
    key: TestStatus.Fail,
  },
  {
    title: "Skip",
    value: TestStatus.Skip,
    key: TestStatus.Skip,
  },
  {
    title: "Silent Fail",
    value: TestStatus.SilentFail,
    key: TestStatus.SilentFail,
  },
];

const useQueryParamStatuses = (search: string) => {
  const parsed = queryString.parse(search, { arrayFormat });
  const statuses = parsed[RequiredQueryParams.Statuses];
  return Array.isArray(statuses) ? statuses : [statuses].filter(v => v);
};
