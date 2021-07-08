import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { Input } from "antd";
import { TaskStatusFilters } from "components/TaskStatusFilters";

export interface FilterState {
  baseStatuses: string[];
  limit: number;
  page: number;
  patchId: string;
  statuses: string[];
  taskName?: string;
  variant?: string;
}

interface TaskFilterProps {
  filters: FilterState;
  onFilterChange: React.Dispatch<Partial<FilterState>>;
  patchId: string;
}

export const TaskFilters: React.FC<TaskFilterProps> = ({
  filters,
  onFilterChange,
  patchId,
}) => (
  <FiltersWrapper>
    <Input
      style={{ width: "25%" }}
      data-cy="task-name-input"
      placeholder="Search Task Name"
      suffix={<Icon glyph="MagnifyingGlass" />}
      value={filters.taskName}
      onChange={(e) => onFilterChange({ taskName: e.target.value })}
    />
    <Input
      style={{ width: "25%" }}
      data-cy="variant-input"
      placeholder="Search Variant Name"
      suffix={<Icon glyph="MagnifyingGlass" />}
      value={filters.variant}
      onChange={(e) => onFilterChange({ variant: e.target.value })}
    />
    <TaskStatusFilters
      onChangeBaseStatusFilter={(arg) => onFilterChange({ baseStatuses: arg })}
      onChangeStatusFilter={(arg) => onFilterChange({ statuses: arg })}
      patchId={patchId}
      selectedBaseStatuses={filters.baseStatuses}
      selectedStatuses={filters.statuses}
    />
  </FiltersWrapper>
);

const FiltersWrapper = styled.div`
  display: flex;
  margin-bottom: 12px;
  > :not(:last-child) {
    margin-right: 20px;
  }
`;
