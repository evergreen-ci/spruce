import React from "react";
import { TestsTableCore } from "./testsTable/TestsTableCore";
import { StatusSelector } from "./testsTable/StatusSelector";
import { FiltersWrapper, StyledInput } from "components/styles";
import Icon from "@leafygreen-ui/icon";
import { useFilterInputChangeHandler } from "hooks/useFilterInputChangeHandler";
import { RequiredQueryParams } from "types/task";

export const TestsTable: React.FC = () => {
  const [
    testNameFilterValue,
    testNameFilterValueOnChange,
  ] = useFilterInputChangeHandler(RequiredQueryParams.TestName);

  return (
    <>
      <FiltersWrapper>
        <StyledInput
          placeholder="Search Test Names"
          onChange={testNameFilterValueOnChange}
          suffix={<Icon glyph="MagnifyingGlass" />}
          value={testNameFilterValue}
          data-cy="testname-input"
          width="25%"
        />
        <StatusSelector />
      </FiltersWrapper>
      <TestsTableCore />
    </>
  );
};
