import { Label } from "@leafygreen-ui/typography";
import { usePatchAnalytics } from "analytics";
import { Dropdown, TreeSelect } from "components/TreeSelect";
import { taskStatusesFilterTreeData } from "constants/task";
import { useStatusesFilter } from "hooks";
import { PatchTasksQueryParams } from "types/task";

/* Notes
 * - is there any reason we would want to filter taskStatusesFilterTreeData?
 */

export const StatusSelect = () => {
  /* const [
    selectedTasks,
    patchStatusFilterTerm,
    baseStatusFilterTerm,
    { toggleSelectedTask, setPatchStatusFilterTerm, setBaseStatusFilterTerm },
  ] = usePatchStatusSelect(patchBuildVariants); */
  const patchAnalytics = usePatchAnalytics();
  const sendFilterTasksEvent = (filterBy: string) =>
    patchAnalytics.sendEvent({ name: "Filter Tasks", filterBy });

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
