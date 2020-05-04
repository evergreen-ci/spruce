import React from "react";
import {
  MyPatchesQueryParams,
  PatchStatus,
  ALL_PATCH_STATUS,
} from "types/patch";
import { TreeSelect } from "components/TreeSelect";
import { useStatusesFilter } from "hooks";

export const StatusSelector: React.FC = () => {
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
    value: ALL_PATCH_STATUS,
    key: ALL_PATCH_STATUS,
  },
  {
    title: "Created",
    value: PatchStatus.Created,
    key: PatchStatus.Created,
  },
  {
    title: "Running",
    value: PatchStatus.Started,
    key: PatchStatus.Started,
  },
  {
    title: "Succeeded",
    value: PatchStatus.Success,
    key: PatchStatus.Success,
  },
  {
    title: "Failed",
    value: PatchStatus.Failed,
    key: PatchStatus.Failed,
  },
];
