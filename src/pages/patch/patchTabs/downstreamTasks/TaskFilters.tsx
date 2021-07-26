import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { Input } from "antd";
import { TaskStatusFilters } from "components/TaskStatusFilters";
import { SortOrder } from "gql/generated/types";

export interface FilterState {
  baseStatuses: string[];
  limit: number;
  page: number;
  patchId: string;
  sorts: SortOrder[];
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
      onChange={(e) => onFilterChange({ taskName: e.target.value, page: 0 })}
    />
    <Input
      style={{ width: "25%" }}
      data-cy="variant-input"
      placeholder="Search Variant Name"
      suffix={<Icon glyph="MagnifyingGlass" />}
      value={filters.variant}
      onChange={(e) => onFilterChange({ variant: e.target.value, page: 0 })}
    />
    <TaskStatusFilters
      onChangeBaseStatusFilter={(baseStatuses) =>
        onFilterChange({ baseStatuses, page: 0 })
      }
      onChangeStatusFilter={(statuses) => onFilterChange({ statuses, page: 0 })}
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
