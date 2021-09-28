import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Disclaimer } from "@leafygreen-ui/typography";
import every from "lodash.every";
import { Button } from "components/Button";
import { PatchTriggerAlias } from "gql/generated/types";
import {
  AliasState,
  ChildPatchComplete,
  VariantTasksState,
} from "hooks/useConfigurePatch";

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
  selectedAliases: AliasState;
  setSelectedAliases: (aliases: AliasState) => void;
  childPatches: ChildPatchComplete[];
  selectableAliases: PatchTriggerAlias[];
}

export const ConfigureTasks: React.FC<Props> = ({
  selectedBuildVariants,
  selectedBuildVariantTasks,
  setSelectedBuildVariantTasks,
  activated,
  loading,
  onClickSchedule,
  selectedAliases,
  setSelectedAliases,
  childPatches,
  selectableAliases,
}) => {
  const aliasCount = Object.values(selectedAliases).reduce(
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
  const currentAliases = getVisibleAliases(
    selectedAliases,
    selectedBuildVariants
  );
  const currentAliasTasks = selectableAliases.filter(({ alias }) =>
    selectedBuildVariants.includes(alias)
  );
  const currentChildPatches = getVisibleChildPatches(
    childPatches,
    selectedBuildVariants
  );

  // Show details related to child patches (i.e. list all variants/tasks) only if it is the only menu item selected
  const enumerateChildPatches =
    currentChildPatches.length === 1 && selectedBuildVariants.length === 1;
  const enumerateAliases =
    currentAliasTasks.length === 1 && selectedBuildVariants.length === 1;

  const onClickCheckbox = (taskName: string) => (e) => {
    const selectedBuildVariantsCopy = { ...selectedBuildVariantTasks };
    const selectedAliasesCopy = { ...selectedAliases };
    selectedBuildVariants.forEach((v) => {
      if (selectedBuildVariantsCopy?.[v]?.[taskName] !== undefined) {
        selectedBuildVariantsCopy[v][taskName] = e.target.checked;
      } else if (selectedAliasesCopy?.[v] !== undefined) {
        selectedAliasesCopy[v] = e.target.checked;
      }
    });
    setSelectedBuildVariantTasks(selectedBuildVariantsCopy);
    setSelectedAliases(selectedAliasesCopy);
  };

  const onClickSelectAll = (e) => {
    const selectedBuildVariantsCopy = { ...selectedBuildVariantTasks };
    const selectedAliasesCopy = { ...selectedAliases };
    selectedBuildVariants.forEach((v) => {
      if (selectedBuildVariantsCopy?.[v] !== undefined) {
        Object.keys(selectedBuildVariantsCopy[v]).forEach((task) => {
          selectedBuildVariantsCopy[v][task] = e.target.checked;
        });
      } else if (selectedAliasesCopy?.[v] !== undefined) {
        selectedAliasesCopy[v] = e.target.checked;
      }
    });
    setSelectedBuildVariantTasks(selectedBuildVariantsCopy);
    setSelectedAliases(selectedAliasesCopy);
  };

  const selectAllCheckboxState = getSelectAllCheckboxState(
    currentTasks,
    currentAliases,
    enumerateChildPatches
  );
  const selectAllCheckboxCopy =
    Object.entries(currentTasks).length === 0
      ? `Add alias${selectedBuildVariants.length > 1 ? "es" : ""} to patch`
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
          indeterminate={selectAllCheckboxState === CheckboxState.INDETERMINITE}
          onChange={onClickSelectAll}
          label={selectAllCheckboxCopy}
          checked={selectAllCheckboxState === CheckboxState.CHECKED}
          disabled={
            (activated && Object.entries(currentAliases).length > 0) ||
            enumerateChildPatches
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
      {/* Include a checkbox representing downstream tasks only if a child patch or alias is selected */}
      {(Object.entries(currentAliases).length > 0 ||
        currentChildPatches.length > 0) && (
        <>
          <H4>Downstream Tasks</H4>
          <Tasks>
            {Object.entries(currentAliases).map(([name, status]) => (
              <Checkbox
                data-cy="alias-checkbox"
                key={name}
                onChange={onClickCheckbox(name)}
                label={name}
                indeterminate={status === CheckboxState.INDETERMINITE}
                checked={status === CheckboxState.CHECKED}
                disabled={activated}
              />
            ))}
            {/* Represent child patches invoked from CLI as read-only */}
            {currentChildPatches.map(({ alias }) => (
              <Checkbox
                data-cy="child-patch-checkbox"
                key={alias}
                label={alias}
                disabled
                checked
              />
            ))}
          </Tasks>
        </>
      )}
      {enumerateChildPatches && (
        <>
          {currentChildPatches[0].variantsTasks.map((variantTasks) => (
            <VariantTasksList
              {...variantTasks}
              status={CheckboxState.CHECKED}
            />
          ))}
        </>
      )}
      {enumerateAliases && (
        <>
          {currentAliasTasks[0].variantsTasks.map(
            ({ name, tasks: aliasTasks }) => (
              <VariantTasksList
                name={name}
                status={currentAliases[currentAliasTasks[0].alias]}
                tasks={aliasTasks}
              />
            )
          )}
        </>
      )}
    </TabContentWrapper>
  );
};

interface VariantTasksListProps {
  name: string;
  status: CheckboxState;
  tasks: string[];
}

const VariantTasksList: React.FC<VariantTasksListProps> = ({
  name,
  status,
  tasks,
}) => (
  <>
    <H4>{name}</H4>
    <Tasks>
      {tasks.map((taskName) => (
        <Checkbox
          data-cy="child-patch-checkbox"
          key={taskName}
          label={taskName}
          checked={status === CheckboxState.CHECKED}
          disabled
        />
      ))}
    </Tasks>
  </>
);

const getSelectAllCheckboxState = (
  buildVariants: {
    [task: string]: CheckboxState;
  },
  aliases: {
    [alias: string]: CheckboxState;
  },
  enumerateChildPatches: boolean
): CheckboxState => {
  if (enumerateChildPatches) {
    return CheckboxState.CHECKED;
  }

  let state;
  const allTaskStatuses = Object.values(buildVariants);
  const allAliasStatuses = Object.values(aliases);

  const hasSelectedTasks =
    allTaskStatuses.includes(CheckboxState.CHECKED) ||
    allAliasStatuses.includes(CheckboxState.CHECKED);
  const hasUnselectedTasks =
    allTaskStatuses.includes(CheckboxState.UNCHECKED) ||
    allAliasStatuses.includes(CheckboxState.UNCHECKED);
  if (hasSelectedTasks && !hasUnselectedTasks) {
    state = CheckboxState.CHECKED;
  } else if (!hasSelectedTasks && hasUnselectedTasks) {
    state = CheckboxState.UNCHECKED;
  } else {
    state = CheckboxState.INDETERMINITE;
  }

  return state;
};

const getVisibleAliases = (
  selectedAliases: AliasState,
  selectedBuildVariants: string[]
): { [key: string]: CheckboxState } => {
  const visiblePatches = {};
  Object.entries(selectedAliases).forEach(([alias]) => {
    if (selectedBuildVariants.includes(alias)) {
      visiblePatches[alias] = selectedAliases[alias]
        ? CheckboxState.CHECKED
        : CheckboxState.UNCHECKED;
    }
  });
  return visiblePatches;
};

const getVisibleChildPatches = (
  childPatches: ChildPatchComplete[],
  selectedBuildVariants: string[]
): ChildPatchComplete[] => {
  if (!childPatches) {
    return [];
  }

  return childPatches.filter(({ alias }) =>
    selectedBuildVariants.includes(alias)
  );
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
const H4 = styled.h4`
  margin-top: 16px;
`;
