import React from "react";
import Icon from "@leafygreen-ui/icon";
import { useTaskAnalytics } from "analytics";
import { FiltersWrapper, StyledInput } from "components/styles";
import { useFilterInputChangeHandler } from "hooks/useFilterInputChangeHandler";
import { TestsTableCore } from "pages/task/taskTabs/testsTable/TestsTableCore";
import { RequiredQueryParams } from "types/task";

export const TestsTable: React.FC = () => {
  const taskAnalytics = useTaskAnalytics();
  const sendFilterTestsEvent = (filterBy: string) =>
    taskAnalytics.sendEvent({ name: "Filter Tests", filterBy });

  const [
    testNameFilterValue,
    testNameFilterValueOnChange,
  ] = useFilterInputChangeHandler({
    urlParam: RequiredQueryParams.TestName,
    resetPage: true,
    sendAnalyticsEvent: sendFilterTestsEvent,
  });

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
      </FiltersWrapper>
      <TestsTableCore />
    </>
  );
};
