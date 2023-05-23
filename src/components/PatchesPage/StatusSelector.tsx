import { useMemo } from "react";
import Dropdown from "components/Dropdown";
import { TreeSelect } from "components/TreeSelect";
import { noFilterMessage } from "constants/strings";
import { useStatusesFilter } from "hooks";
import { useQueryParam } from "hooks/useQueryParam";
import {
  PatchPageQueryParams,
  PatchStatus,
  ALL_PATCH_STATUS,
} from "types/patch";

export const StatusSelector: React.VFC = () => {
  const { inputValue: statusVal, setAndSubmitInputValue: statusValOnChange } =
    useStatusesFilter({ urlParam: PatchPageQueryParams.Statuses });
  const [includeCommitQueue] = useQueryParam(
    PatchPageQueryParams.CommitQueue,
    true
  );
  const treeData = useMemo(
    () => getTreeData(includeCommitQueue),
    [includeCommitQueue]
  );
  return (
    <Dropdown
      data-cy="my-patch-status-select"
      buttonText={`Patch Status: ${
        statusVal.length ? statusVal.join(", ") : noFilterMessage
      }`}
    >
      <TreeSelect
        onChange={statusValOnChange}
        state={statusVal}
        tData={treeData}
        hasStyling={false}
      />
    </Dropdown>
  );
};

const getTreeData = (includeCommitQueue: boolean) => [
  {
    title: "All",
    value: ALL_PATCH_STATUS,
    key: ALL_PATCH_STATUS,
  },
  {
    title: includeCommitQueue ? "Created/Unconfigured" : "Unconfigured",
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
