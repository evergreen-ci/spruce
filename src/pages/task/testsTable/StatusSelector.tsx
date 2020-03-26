import React from "react";
import { TestStatus } from "types/task";
import { TreeSelect } from "components/TreeSelect";
import { useStatusesFilter } from "hooks";
import { RequiredQueryParams } from "types/task";

export const StatusSelector = () => {
  const [value, onChange] = useStatusesFilter(RequiredQueryParams.Statuses);
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
