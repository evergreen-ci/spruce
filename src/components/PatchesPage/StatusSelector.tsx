import Dropdown from "components/Dropdown";
import { TreeSelect } from "components/TreeSelect";
import { useStatusesFilter } from "hooks";
import {
  PatchPageQueryParams,
  PatchStatus,
  ALL_PATCH_STATUS,
} from "types/patch";

export const StatusSelector: React.FC = () => {
  const {
    inputValue: statusVal,
    setAndSubmitInputValue: statusValOnChange,
  } = useStatusesFilter({ urlParam: PatchPageQueryParams.Statuses });
  const noFilterMessage = "No filters selected";

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
