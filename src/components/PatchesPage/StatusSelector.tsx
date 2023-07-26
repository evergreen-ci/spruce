import Dropdown from "components/Dropdown";
import { TreeSelect } from "components/TreeSelect";
import { noFilterMessage } from "constants/strings";
import { useStatusesFilter } from "hooks";
import {
  PatchPageQueryParams,
  PatchStatus,
  ALL_PATCH_STATUS,
} from "types/patch";

export const StatusSelector: React.VFC = () => {
  const { inputValue: statusVal, setAndSubmitInputValue: statusValOnChange } =
    useStatusesFilter({ urlParam: PatchPageQueryParams.Statuses });

  return (
    <Dropdown
      data-cy="my-patch-status-select"
      buttonText={`Patch Status: ${
        statusVal.length
          ? statusVal.map((v) => statusValToCopy[v]).join(", ")
          : noFilterMessage
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

const statusValToCopy = {
  [ALL_PATCH_STATUS]: "All",
  [PatchStatus.Created]: "Created/Unconfigured",
  [PatchStatus.Failed]: "Failed",
  [PatchStatus.Started]: "Running",
  [PatchStatus.Success]: "Succeeded",
};

const treeData = [
  {
    key: ALL_PATCH_STATUS,
    title: statusValToCopy[ALL_PATCH_STATUS],
    value: ALL_PATCH_STATUS,
  },
  {
    key: PatchStatus.Created,
    title: statusValToCopy[PatchStatus.Created],
    value: PatchStatus.Created,
  },
  {
    key: PatchStatus.Started,
    title: statusValToCopy[PatchStatus.Started],
    value: PatchStatus.Started,
  },
  {
    key: PatchStatus.Success,
    title: statusValToCopy[PatchStatus.Success],
    value: PatchStatus.Success,
  },
  {
    key: PatchStatus.Failed,
    title: statusValToCopy[PatchStatus.Failed],
    value: PatchStatus.Failed,
  },
];
