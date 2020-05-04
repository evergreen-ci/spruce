import React from "react";
import { RequiredQueryParams } from "types/task";
import { TestStatus } from "types/task";
import { TreeSelect } from "components/TreeSelect";
import { useStatusesFilter } from "hooks";

export const StatusSelector: React.FC = () => {
  const [statusVal, statusValOnChange] = useStatusesFilter(
    RequiredQueryParams.Statuses
  );

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
