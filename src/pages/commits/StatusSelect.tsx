import { Label } from "@leafygreen-ui/typography";
import { useProjectAnalytics } from "analytics";
import { Dropdown, TreeSelect } from "components/TreeSelect";
import { taskStatusesFilterTreeData } from "constants/task";
import { useStatusesFilter } from "hooks";
import { PatchTasksQueryParams } from "types/task";

export const StatusSelect = () => {
  const projectAnalytics = useProjectAnalytics();
  const sendFilterTasksEvent = (filterBy: string) =>
    projectAnalytics.sendEvent({ name: "Filter Tasks", filterBy });

  const [selectedStatuses, onChangeStatusFilter] = useStatusesFilter(
    PatchTasksQueryParams.Statuses,
    false,
    sendFilterTasksEvent
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
            onChange={onChangeStatusFilter}
            tData={taskStatusesFilterTreeData}
            state={selectedStatuses}
          />
        )}
      />
    </>
  );
};
