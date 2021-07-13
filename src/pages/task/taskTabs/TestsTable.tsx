import React from "react";
import Icon from "@leafygreen-ui/icon";
import { useTaskAnalytics } from "analytics";
import { FiltersWrapper, StyledInput } from "components/styles";
import { Dropdown, TreeSelect } from "components/TreeSelect";
import { useStatusesFilter } from "hooks";
import { useFilterInputChangeHandler } from "hooks/useFilterInputChangeHandler";
import { TestsTableCore } from "pages/task/taskTabs/testsTable/TestsTableCore";
import { RequiredQueryParams, TestStatus } from "types/task";

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
        <Dropdown
          data-cy="test-status-select"
          inputLabel="Test Status:  "
          width="25%"
          render={({ getDropdownProps }) => (
            <TreeSelect
              {...getDropdownProps()}
              onChange={statusValOnChange}
              state={statusVal}
              tData={treeData}
            />
          )}
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
