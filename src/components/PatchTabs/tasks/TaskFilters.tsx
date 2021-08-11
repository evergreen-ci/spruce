import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { Input } from "antd";
import { useParams } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { TaskStatusFilters } from "components/TaskStatusFilters";
import { useFilterInputChangeHandler, useStatusesFilter } from "hooks";
import { PatchTasksQueryParams } from "types/task";

export const TaskFilters: React.FC = () => {
  const patchAnalytics = usePatchAnalytics();
  const sendFilterTasksEvent = (filterBy: string) =>
    patchAnalytics.sendEvent({ name: "Filter Tasks", filterBy });

  const [
    variantFilterValue,
    variantFilterValueOnChange,
  ] = useFilterInputChangeHandler(
    PatchTasksQueryParams.Variant,
    true,
    sendFilterTasksEvent
  );
  const [
    taskNameFilterValue,
    taskNameFilterValueOnChange,
  ] = useFilterInputChangeHandler(
    PatchTasksQueryParams.TaskName,
    true,
    sendFilterTasksEvent
  );
  const [selectedStatuses, onChangeStatusFilter] = useStatusesFilter(
    PatchTasksQueryParams.Statuses,
    true,
    sendFilterTasksEvent
  );
  const [selectedBaseStatuses, onChangeBaseStatusFilter] = useStatusesFilter(
    PatchTasksQueryParams.BaseStatuses,
    true,
    sendFilterTasksEvent
  );

  const { id: patchId } = useParams<{ id: string }>();

  return (
    <FiltersWrapper>
      <Input
        style={{ width: "25%" }}
        data-cy="task-name-input"
        placeholder="Search Task Name"
        suffix={<Icon glyph="MagnifyingGlass" />}
        value={taskNameFilterValue}
        onChange={taskNameFilterValueOnChange}
      />
      <Input
        style={{ width: "25%" }}
        data-cy="variant-input"
        placeholder="Search Variant Name"
        suffix={<Icon glyph="MagnifyingGlass" />}
        value={variantFilterValue}
        onChange={variantFilterValueOnChange}
      />
      <TaskStatusFilters
        onChangeBaseStatusFilter={onChangeBaseStatusFilter}
        onChangeStatusFilter={onChangeStatusFilter}
        versionId={patchId}
        selectedBaseStatuses={selectedBaseStatuses}
        selectedStatuses={selectedStatuses}
      />
    </FiltersWrapper>
  );
};

const FiltersWrapper = styled.div`
  display: flex;
  margin-bottom: 12px;
  > :not(:last-child) {
    margin-right: 20px;
  }
`;
