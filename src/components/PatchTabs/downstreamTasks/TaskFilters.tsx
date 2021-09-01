import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { Input } from "antd";
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
}

export const TaskFilters: React.FC<TaskFilterProps> = ({
  filters,
  onFilterChange,
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
  </FiltersWrapper>
);

const FiltersWrapper = styled.div`
  display: flex;
  margin-bottom: 12px;
  > :not(:last-child) {
    margin-right: 20px;
  }
`;
