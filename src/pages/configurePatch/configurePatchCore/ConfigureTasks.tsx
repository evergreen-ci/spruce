import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Disclaimer } from "@leafygreen-ui/typography";
import every from "lodash.every";
import { Button } from "components/Button";
import { DownstreamPatchState, VariantTasksState } from "./state";

enum CheckboxState {
  CHECKED = "CHECKED",
  INDETERMINITE = "INDETERMINITE",
  UNCHECKED = "UNCHECKED",
}
interface Props {
  selectedBuildVariants: string[];
  selectedBuildVariantTasks: VariantTasksState;
  setSelectedBuildVariantTasks: (vt: VariantTasksState) => void;
  activated: boolean;
  loading: boolean;
  onClickSchedule: () => void;
  selectedDownstreamPatches: DownstreamPatchState;
  setSelectedDownstreamPatches: (patches: DownstreamPatchState) => void;
}

export const ConfigureTasks: React.FC<Props> = ({
  selectedBuildVariants,
  selectedBuildVariantTasks,
  setSelectedBuildVariantTasks,
  activated,
  loading,
  onClickSchedule,
  selectedDownstreamPatches,
  setSelectedDownstreamPatches,
}) => {
  const aliasCount = Object.values(selectedDownstreamPatches).reduce(
    (count, alias) => count + (alias ? 1 : 0),
    0
  );
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
    (bv) => selectedBuildVariantTasks[bv] || {}
  );

  const currentTasks = deduplicateTasks(tasks);
  const currentDownstreamPatches = getVisibleDownstreamPatches(
    selectedDownstreamPatches,
    selectedBuildVariants
  );

  const onClickCheckbox = (taskName: string) => (e) => {
    const selectedBuildVariantsCopy = { ...selectedBuildVariantTasks };
    const selectedDownstreamPatchesCopy = { ...selectedDownstreamPatches };
    selectedBuildVariants.forEach((v) => {
      if (selectedBuildVariantsCopy?.[v]?.[taskName] !== undefined) {
        selectedBuildVariantsCopy[v][taskName] = e.target.checked;
      } else if (selectedDownstreamPatchesCopy?.[v] !== undefined) {
        selectedDownstreamPatchesCopy[v] = e.target.checked;
      }
    });
    setSelectedBuildVariantTasks(selectedBuildVariantsCopy);
    setSelectedDownstreamPatches(selectedDownstreamPatchesCopy);
  };

  const onClickSelectAll = (e) => {
    const selectedBuildVariantsCopy = { ...selectedBuildVariantTasks };
    const selectedDownstreamPatchesCopy = { ...selectedDownstreamPatches };
    selectedBuildVariants.forEach((v) => {
      if (selectedBuildVariantsCopy?.[v]) {
        Object.keys(selectedBuildVariantsCopy[v]).forEach((task) => {
          selectedBuildVariantsCopy[v][task] = e.target.checked;
        });
      } else if (selectedDownstreamPatchesCopy?.[v]) {
        selectedDownstreamPatchesCopy[v] = e.target.checked;
      }
    });
    setSelectedBuildVariantTasks(selectedBuildVariantsCopy);
    setSelectedDownstreamPatches(selectedDownstreamPatchesCopy);
  };

  const selectAllCheckboxState = getSelectAllCheckboxState(
    currentTasks,
    currentDownstreamPatches
  );
  const selectAllCheckboxCopy =
    Object.entries(currentTasks).length === 0
      ? `Select all tasks in ${
          selectedBuildVariants.length > 1
            ? "these trigger aliases"
            : "this trigger alias"
        }`
      : `Select all tasks in ${
          selectedBuildVariants.length > 1 ? "these variants" : "this variant"
        }`;
  const selectedTaskDisclaimerCopy = `${taskCount} task${
    taskCount !== 1 ? "s" : ""
  } across ${buildVariantCount} build variant${
    buildVariantCount !== 1 ? "s" : ""
  }, ${aliasCount} trigger alias${aliasCount !== 1 ? "es" : ""}`;

  return (
    <TabContentWrapper>
      <Actions>
        <Button
          data-cy="schedule-patch"
          variant="primary"
          onClick={onClickSchedule}
          disabled={(taskCount === 0 && aliasCount === 0) || loading}
          loading={loading}
        >
          Schedule
        </Button>
        <Checkbox
          data-cy="select-all-checkbox"
          data-state={selectAllCheckboxState}
          // TODO: Fix indeterminate state handling after PD-1386
          indeterminate={selectAllCheckboxState === CheckboxState.INDETERMINITE}
          onChange={onClickSelectAll}
          label={selectAllCheckboxCopy}
          checked={selectAllCheckboxState === CheckboxState.CHECKED}
          disabled={
            activated && Object.entries(currentDownstreamPatches).length > 0
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
            data-state={status}
            key={name}
            onChange={onClickCheckbox(name)}
            label={name}
            // TODO: Fix indeterminate state handling after PD-1386
            indeterminate={status === CheckboxState.INDETERMINITE}
            checked={status === CheckboxState.CHECKED}
          />
        ))}
        {/* Include a checkbox representing trigger aliases only if multiple sidebar items are selected */}
        {selectedBuildVariants.length > 1 &&
          Object.entries(currentDownstreamPatches).map(([name, status]) => (
            <Checkbox
              data-cy="downstream-patch-checkbox"
              data-state={status}
              key={name}
              onChange={onClickCheckbox(name)}
              label={name}
              // TODO: Fix indeterminate state handling after PD-1386
              indeterminate={status === CheckboxState.INDETERMINITE}
              checked={status === CheckboxState.CHECKED}
              disabled={activated}
            />
          ))}
      </Tasks>
    </TabContentWrapper>
  );
};

const getSelectAllCheckboxState = (
  buildVariants: {
    [task: string]: CheckboxState;
  },
  downstreamPatches: {
    [alias: string]: CheckboxState;
  }
): CheckboxState => {
  let state;
  const allTaskStatuses = Object.entries(buildVariants).map(
    ([, checked]) => checked
  );

  const allDownstreamPatchStatuses = Object.entries(downstreamPatches).map(
    ([, checked]) => checked
  );

  const hasSelectedTasks =
    allTaskStatuses.includes(CheckboxState.CHECKED) ||
    allDownstreamPatchStatuses.includes(CheckboxState.CHECKED);
  const hasUnselectedTasks =
    allTaskStatuses.includes(CheckboxState.UNCHECKED) ||
    allDownstreamPatchStatuses.includes(CheckboxState.UNCHECKED);
  if (hasSelectedTasks && !hasUnselectedTasks) {
    state = CheckboxState.CHECKED;
  } else if (!hasSelectedTasks && hasUnselectedTasks) {
    state = CheckboxState.UNCHECKED;
  } else {
    state = CheckboxState.INDETERMINITE;
  }

  return state;
};

const getVisibleDownstreamPatches = (p, selectedBuildVariants) => {
  const visiblePatches = {};
  Object.entries(p).forEach(([alias]) => {
    if (selectedBuildVariants.includes(alias)) {
      visiblePatches[alias] = p[alias]
        ? CheckboxState.CHECKED
        : CheckboxState.UNCHECKED;
    }
  });
  return visiblePatches;
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
          // If a task is UNCHECKED and the next task of the same name is CHECKED it is INDETERMINATE
          visibleTasks[taskName] = value
            ? CheckboxState.INDETERMINITE
            : CheckboxState.UNCHECKED;
          break;
        case CheckboxState.CHECKED:
          // If a task is CHECKED and the next task of the same name is UNCHECKED it is INDETERMINATE
          visibleTasks[taskName] = value
            ? CheckboxState.CHECKED
            : CheckboxState.INDETERMINITE;
          break;
        case CheckboxState.INDETERMINITE:
          // If a task is INDETERMINATE because of previous task statuses
          // it wouldn't change when subsequent statuses are considered
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
const cardSidePadding = css`
  padding-left: 8px;
  padding-right: 8px;
`;
const TabContentWrapper = styled.div`
  ${cardSidePadding}
`;
