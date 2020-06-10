import React from "react";
import { FiltersWrapper, StyledInput } from "components/styles";
import Icon from "@leafygreen-ui/icon";
import { useFilterInputChangeHandler } from "hooks/useFilterInputChangeHandler";
import { RequiredQueryParams, TestStatus } from "types/task";
import { TestsTableCore } from "pages/task/testsTable/TestsTableCore";
import { useTaskAnalytics } from "analytics";
import { TreeSelect } from "components/TreeSelect";
import { useStatusesFilter } from "hooks";

export const TestsTable: React.FC = () => {
  const taskAnalytics = useTaskAnalytics();
  const sendFilterTestsEvent = (filterBy: string) =>
    taskAnalytics.sendEvent({ name: "Filter Tests", filterBy });

  const [
    testNameFilterValue,
    testNameFilterValueOnChange,
  ] = useFilterInputChangeHandler(
    RequiredQueryParams.TestName,
    true,
    sendFilterTestsEvent
  );

  const [statusVal, statusValOnChange] = useStatusesFilter(
    RequiredQueryParams.Statuses,
    false,
    sendFilterTestsEvent
  );

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
        <TreeSelect
          onChange={statusValOnChange}
          state={statusVal}
          tData={treeData}
          inputLabel="Test Status:  "
          dataCy="test-status-select"
          width="25%"
        />
      </FiltersWrapper>
      <TestsTableCore />
    </>
  );
};

const treeData = [
  {
    title: "All",
    value: TestStatus.All,
    key: TestStatus.All,
  },
  {
    title: "Pass",
    value: TestStatus.Pass,
    key: TestStatus.Pass,
  },
  {
    title: "Fail",
    value: TestStatus.Fail,
    key: TestStatus.Fail,
  },
  {
    title: "Skip",
    value: TestStatus.Skip,
    key: TestStatus.Skip,
  },
  {
    title: "Silent Fail",
    value: TestStatus.SilentFail,
    key: TestStatus.SilentFail,
  },
];
