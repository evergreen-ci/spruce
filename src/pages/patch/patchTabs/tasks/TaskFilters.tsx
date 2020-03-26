import React from "react";
import { useFilterInputChangeHandler } from "hooks";
import Icon from "@leafygreen-ui/icon";
import { TaskSortBy } from "gql/queries/get-patch-tasks";
import { FiltersWrapper, StyledInput } from "components/styles";

export const TaskFilters: React.FC = () => {
  const [
    variantFilterValue,
    variantFilterValueOnChange
  ] = useFilterInputChangeHandler(TaskSortBy.Variant);
  const [
    taskNameFilterValue,
    taskNameFilterValueOnChange
  ] = useFilterInputChangeHandler(TaskSortBy.Name);

  return (
    <FiltersWrapper>
      <StyledInput
        data-cy="task-name-input"
        placeholder="Search Task Name"
        suffix={<Icon glyph="MagnifyingGlass" />}
        value={taskNameFilterValue}
        onChange={taskNameFilterValueOnChange}
      />
      <StyledInput
        data-cy="variant-input"
        placeholder="Search Variant Name"
        suffix={<Icon glyph="MagnifyingGlass" />}
        value={variantFilterValue}
        onChange={variantFilterValueOnChange}
      />
    </FiltersWrapper>
  );
};
