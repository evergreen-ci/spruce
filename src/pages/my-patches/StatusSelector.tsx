import React from "react";
import { MyPatchesQueryParams, PatchStatus } from "types/patch";
import { TreeSelect } from "components/TreeSelect";
import { useStatusesFilter } from "hooks";

export const StatusSelector = () => {
  const [statusVal, statusValOnChange] = useStatusesFilter(
    MyPatchesQueryParams.Statuses
  );

  return (
    <TreeSelect
      onChange={statusValOnChange}
      state={statusVal}
      tData={treeData}
      inputLabel="Patch status:  "
      dataCy="test-status-select"
      width="25%"
    />
  );
};

const treeData = [
  {
    title: "All",
    value: PatchStatus.All,
    key: PatchStatus.All,
  },
  {
    title: "Created",
    value: PatchStatus.Created,
    key: PatchStatus.Created,
  },
  {
    title: "Started",
    value: PatchStatus.Started,
    key: PatchStatus.Started,
  },
  {
    title: "Success",
    value: PatchStatus.Success,
    key: PatchStatus.Success,
  },
  {
    title: "Failed",
    value: PatchStatus.Failed,
    key: PatchStatus.Failed,
  },
];
