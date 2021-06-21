import { Label } from "@leafygreen-ui/typography";
import { usePatchAnalytics } from "analytics";
import { TreeSelect } from "components/TreeSelect";
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
      <TreeSelect
        onChange={onChangeStatusFilter}
        tData={taskStatusesFilterTreeData}
        state={selectedStatuses}
        inputLabel="Task Status: "
        data-cy="project-test-status-select"
      />
    </>
  );
};
