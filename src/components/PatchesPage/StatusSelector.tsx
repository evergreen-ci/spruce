import React from "react";
import { Dropdown, TreeSelect } from "components/TreeSelect";
import { useStatusesFilter } from "hooks";
import {
  MyPatchesQueryParams,
  PatchStatus,
  ALL_PATCH_STATUS,
} from "types/patch";

export const StatusSelector: React.FC = () => {
  const {
    inputValue: statusVal,
    setAndSubmitInputValue: statusValOnChange,
  } = useStatusesFilter({ urlParam: MyPatchesQueryParams.Statuses });

  return (
    <Dropdown
      data-cy="my-patch-status-select"
      inputLabel="Patch status:  "
      width="25%"
      render={({ getDropdownProps }) => (
        <TreeSelect
          {...getDropdownProps()}
          onChange={statusValOnChange}
          state={statusVal}
          tData={treeData}
        />
      )}
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
