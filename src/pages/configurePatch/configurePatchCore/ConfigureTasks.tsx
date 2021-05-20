import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Disclaimer } from "@leafygreen-ui/typography";
import every from "lodash.every";
import isEmpty from "lodash/isEmpty";
import { Button } from "components/Button";
import { VariantTasksState } from "pages/configurePatch/ConfigurePatchCore";

enum CheckboxState {
  CHECKED = "CHECKED",
  INDETERMINITE = "INDETERMINITE",
  UNCHECKED = "UNCHECKED",
}
interface Props {
  selectedBuildVariants: string[];
  selectedBuildVariantTasks: VariantTasksState;
  setSelectedBuildVariantTasks: (vt: VariantTasksState) => void;
  loading: boolean;
  onClickSchedule: () => void;
}

export const ConfigureTasks: React.FC<Props> = ({
  selectedBuildVariants,
  selectedBuildVariantTasks,
  setSelectedBuildVariantTasks,
  loading,
  onClickSchedule,
}) => {
  const buildVariantCount = Object.values(selectedBuildVariantTasks).reduce(
    (count, taskOb) =>
      count +
      (every(Object.values(taskOb), (isSelected) => !isSelected) ? 0 : 1),
    0
  );
  const taskCount = Object.values(selectedBuildVariantTasks).reduce(
    (count, taskObj) => count + Object.values(taskObj).filter((v) => v).length,
    0
  );

  const tasks = selectedBuildVariants.map(
    (bv) => selectedBuildVariantTasks[bv]
  );

  const currentTasks = deduplicateTasks(tasks);

  const onClickCheckbox = (taskName: string) => (e) => {
    const selectedBuildVariantsCopy = { ...selectedBuildVariantTasks };
    selectedBuildVariants.forEach((bv) => {
      if (selectedBuildVariantsCopy[bv][taskName] !== undefined) {
        selectedBuildVariantsCopy[bv][taskName] = e.target.checked;
      }
    });
    setSelectedBuildVariantTasks(selectedBuildVariantsCopy);
  };

  const onClickSelectAll = (e) => {
    const selectedBuildVariantsCopy = { ...selectedBuildVariantTasks };
    selectedBuildVariants.forEach((bv) => {
      Object.keys(selectedBuildVariantsCopy[bv]).forEach((task) => {
        selectedBuildVariantsCopy[bv][task] = e.target.checked;
      });
    });
    setSelectedBuildVariantTasks(selectedBuildVariantsCopy);
  };

  const selectAllCheckboxState = getSelectAllCheckboxState(currentTasks);
  const selectAllCheckboxCopy = `Select all tasks in ${
    selectedBuildVariants.length > 1 ? "these variants" : "this variant"
  }`;
  const selectedTaskDisclaimerCopy = `${taskCount} task${
    taskCount !== 1 ? "s" : ""
  } across ${buildVariantCount} build variant${
    buildVariantCount !== 1 ? "s" : ""
  }`;

  return (
    <TabContentWrapper>
      <Actions>
        <Button
          data-cy="schedule-patch"
          variant="primary"
          onClick={onClickSchedule}
          disabled={isEmpty(selectedBuildVariantTasks) || loading}
          loading={loading}
        >
          Schedule
        </Button>
        <Checkbox
          data-cy="select-all-checkbox"
          indeterminate={selectAllCheckboxState === CheckboxState.INDETERMINITE}
          onChange={onClickSelectAll}
          label={selectAllCheckboxCopy}
          checked={
            selectAllCheckboxState === CheckboxState.CHECKED ||
            selectAllCheckboxState === CheckboxState.INDETERMINITE
          }
        />
      </Actions>
      <StyledDisclaimer data-cy="selected-task-disclaimer">
        {selectedTaskDisclaimerCopy}
      </StyledDisclaimer>
      <Tasks data-cy="configurePatch-tasks">
        {Object.entries(currentTasks).map(([name, status]) => (
          <Checkbox
            data-cy="task-checkbox"
            key={name}
            onChange={onClickCheckbox(name)}
            label={name}
            indeterminate={status === CheckboxState.INDETERMINITE}
            checked={status === CheckboxState.CHECKED}
          />
        ))}
      </Tasks>
    </TabContentWrapper>
  );
};

const getSelectAllCheckboxState = (buildVariants: {
  [task: string]: CheckboxState;
}): CheckboxState => {
  // iterate through selectedBuildVariants and see if all the checked items represent all the takss in variant
  let state;
  const allStatuses = Object.entries(buildVariants).map(
    ([, checked]) => checked
  );

  const hasSelectedTasks = allStatuses.includes(CheckboxState.CHECKED);
  const hasUnselectedTasks = allStatuses.includes(CheckboxState.UNCHECKED);
  if (hasSelectedTasks && !hasUnselectedTasks) {
    state = CheckboxState.CHECKED;
  } else if (!hasSelectedTasks && hasUnselectedTasks) {
    state = CheckboxState.UNCHECKED;
  } else {
    state = CheckboxState.INDETERMINITE;
  }
  console.log({ hasSelectedTasks, hasUnselectedTasks, state, allStatuses });

  return state;
};

const deduplicateTasks = (
  currentTasks: {
    [task: string]: boolean;
  }[]
) => {
  const visibleTasks = {};
  currentTasks.forEach((bv) => {
    Object.entries(bv).forEach(([taskName, value]) => {
      switch (visibleTasks[taskName]) {
        case CheckboxState.UNCHECKED:
          visibleTasks[taskName] = value
            ? CheckboxState.INDETERMINITE
            : CheckboxState.UNCHECKED;
          break;
        case CheckboxState.CHECKED:
          visibleTasks[taskName] = value
            ? CheckboxState.CHECKED
            : CheckboxState.INDETERMINITE;
          break;
        case CheckboxState.INDETERMINITE:
          break;
        default:
          visibleTasks[taskName] = value
            ? CheckboxState.CHECKED
            : CheckboxState.UNCHECKED;
          break;
      }
    });
  });
  return visibleTasks;
};

const Actions = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  & > :first-of-type {
    margin-right: 40px;
  }
  & > :not(:first-of-type) {
    margin-right: 24px;
  }
`;
const Tasks = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto auto;
  grid-template-areas: "a a";
  grid-auto-rows: auto;
  grid-column-gap: 30px;
  grid-row-gap: 12px;
  overflow: scroll;
  max-height: 60vh;
`;
const StyledDisclaimer = styled(Disclaimer)`
  margin-bottom: 8px;
`;
export const cardSidePadding = css`
  padding-left: 8px;
  padding-right: 8px;
`;
const TabContentWrapper = styled.div`
  ${cardSidePadding}
`;
