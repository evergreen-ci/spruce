import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useFilterInputChangeHandler } from "hooks";
import Icon from "@leafygreen-ui/icon";
import { TaskSortBy } from "gql/queries/get-patch-tasks";
import { FiltersWrapper, StyledInput } from "components/styles";

export const TaskFilters: React.FC = () => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();
  const [
    variantFilterValue,
    variantFilterValueOnChange
  ] = useFilterInputChangeHandler(
    TaskSortBy.Variant,
    pathname,
    search,
    replace
  );

  return (
    <FiltersWrapper>
      <StyledInput
        placeholder="Search Variant Name"
        onChange={variantFilterValueOnChange}
        suffix={<Icon glyph="MagnifyingGlass" />}
        value={variantFilterValue}
        data-cy="variant-input"
      />
    </FiltersWrapper>
  );
};
