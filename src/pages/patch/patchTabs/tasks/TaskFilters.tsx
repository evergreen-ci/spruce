import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import styled from "@emotion/styled";
import { Input } from "antd";
import { useFilterInputChangeHandler } from "hooks";
import Icon from "@leafygreen-ui/icon";
import { TaskSortBy } from "gql/queries/get-patch-tasks";

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

const FiltersWrapper = styled.div`
  display: flex;
  margin-bottom: 20px;
`;
const StyledInput = styled(Input)`
  max-width: 500px;
  margin-right: 40px;
`;
