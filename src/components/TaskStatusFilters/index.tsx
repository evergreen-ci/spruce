import React from "react";
import { Dropdown, TreeSelect } from "components/TreeSelect";
import { useTaskStatuses } from "hooks";

interface Props {
  versionId: string;
  selectedStatuses: string[];
  selectedBaseStatuses: string[];
  onChangeStatusFilter: (s: string[]) => void;
  onChangeBaseStatusFilter: (s: string[]) => void;
  filterWidth?: string;
}

export const TaskStatusFilters: React.FC<Props> = ({
  onChangeBaseStatusFilter,
  onChangeStatusFilter,
  versionId,
  selectedBaseStatuses,
  selectedStatuses,
  filterWidth = "25%",
}) => {
  const { currentStatuses, baseStatuses } = useTaskStatuses({ versionId });

  return (
    <>
      <Dropdown
        data-cy="task-status-filter"
        inputLabel="Task Status: "
        width={filterWidth}
        render={({ getDropdownProps }) => (
          <TreeSelect
            {...getDropdownProps()}
            state={selectedStatuses}
            tData={currentStatuses}
            onChange={onChangeStatusFilter}
          />
        )}
      />
      <Dropdown
        data-cy="task-base-status-filter"
        inputLabel="Task Base Status: "
        width={filterWidth}
        render={({ getDropdownProps }) => (
          <TreeSelect
            {...getDropdownProps()}
            state={selectedBaseStatuses}
            tData={baseStatuses}
            onChange={onChangeBaseStatusFilter}
          />
        )}
      />
    </>
  );
};
