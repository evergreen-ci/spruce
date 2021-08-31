import { Label } from "@leafygreen-ui/typography";
import { Dropdown, TreeSelect } from "components/TreeSelect";
import { taskStatusesFilterTreeData } from "constants/task";
import { useStatusesFilter } from "hooks";
import { PatchTasksQueryParams } from "types/task";

export const StatusSelect = () => {
  const { inputValue, setAndSubmitInputValue } = useStatusesFilter(
    PatchTasksQueryParams.Statuses,
    false
  );
  return (
    <>
      <Label htmlFor="project-test-status-select">Status</Label>
      <Dropdown
        data-cy="project-test-status-select"
        inputLabel="Task Status: "
        render={({ getDropdownProps }) => (
          <TreeSelect
            {...getDropdownProps()}
            onChange={setAndSubmitInputValue}
            tData={taskStatusesFilterTreeData}
            state={inputValue}
          />
        )}
      />
    </>
  );
};
