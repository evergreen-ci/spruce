import React, { useMemo } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body, Disclaimer } from "@leafygreen-ui/typography";
import every from "lodash.every";
import { LoadingButton } from "components/Buttons";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import {
  AliasState,
  ChildPatchAliased,
  PatchTriggerAlias,
  VariantTasksState,
} from "hooks/useConfigurePatch";
import { TaskLayoutGrid } from "./styles";
import { CheckboxState } from "./types";
import VariantTasksList from "./VariantTasksList";

interface Props {
  selectedBuildVariants: string[];
  selectedBuildVariantTasks: VariantTasksState;
  setSelectedBuildVariantTasks: (vt: VariantTasksState) => void;
  activated: boolean;
  loading: boolean;
  onClickSchedule: () => void;
  selectedAliases: AliasState;
  setSelectedAliases: (aliases: AliasState) => void;
  childPatches: ChildPatchAliased[];
  selectableAliases: PatchTriggerAlias[];
}

export const ConfigureTasks: React.VFC<Props> = ({
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
  const childPatchCount = childPatches?.length || 0;
  const downstreamTaskCount = aliasCount + childPatchCount;
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
  const currentTasks = useMemo(() => {
    const tasks = selectedBuildVariants.map(
      (bv) => selectedBuildVariantTasks[bv] || {}
    );
    return deduplicateTasks(tasks);
  }, [selectedBuildVariantTasks, selectedBuildVariants]);

  const sortedCurrentTasks = useMemo(
    () => Object.entries(currentTasks).sort((a, b) => a[0].localeCompare(b[0])),
    [currentTasks]
  );

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

  // Show a child patch's variants/tasks iff it is the only menu item selected
  const enumerateChildPatchTasks =
    currentChildPatches.length === 1 && selectedBuildVariants.length === 1;
  // Show an alias's variants/tasks iff it is the only menu item selected
  const enumerateAliasTasks =
    currentAliasTasks.length === 1 && selectedBuildVariants.length === 1;

  // Only show name of alias or child patch (no variants/tasks) if other build variants are also selected
  const shorthandChildPatchesAndAliases =
    (Object.entries(currentAliases).length > 0 ||
      currentChildPatches.length > 0) &&
    selectedBuildVariants.length > 1;

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

  const onClickSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    enumerateChildPatchTasks
  );
  const selectAllCheckboxCopy =
    sortedCurrentTasks.length === 0
      ? `Add alias${selectedBuildVariants.length > 1 ? "es" : ""} to patch`
      : `Select all tasks in ${
          selectedBuildVariants.length > 1 ? "these variants" : "this variant"
        }`;

  const selectedTaskDisclaimerCopy = `${taskCount} task${
    taskCount !== 1 ? "s" : ""
  } across ${buildVariantCount} build variant${
    buildVariantCount !== 1 ? "s" : ""
  }, ${downstreamTaskCount} trigger alias${
    downstreamTaskCount !== 1 ? "es" : ""
  }`;

  return (
    <TabContentWrapper>
      <Actions>
        <LoadingButton
          data-cy="schedule-patch"
          variant="primary"
          onClick={onClickSchedule}
          disabled={(taskCount === 0 && aliasCount === 0) || loading}
          loading={loading}
        >
          Schedule
        </LoadingButton>
        <div>
          <InlineCheckbox
            data-cy="select-all-checkbox"
            indeterminate={
              selectAllCheckboxState === CheckboxState.INDETERMINITE
            }
            onChange={onClickSelectAll}
            label={selectAllCheckboxCopy}
            checked={selectAllCheckboxState === CheckboxState.CHECKED}
            disabled={
              (activated && Object.entries(currentAliases).length > 0) ||
              enumerateChildPatchTasks
            }
          />
          {enumerateChildPatchTasks && (
            <Tooltip
              justify="middle"
              triggerEvent="hover"
              trigger={
                <IconContainer>
                  <Icon glyph="InfoWithCircle" />
                </IconContainer>
              }
            >
              Aliases specified via CLI cannot be edited.
            </Tooltip>
          )}
        </div>
      </Actions>
      <StyledDisclaimer data-cy="selected-task-disclaimer">
        {selectedTaskDisclaimerCopy}
      </StyledDisclaimer>
      <TaskLayoutGrid data-cy="configurePatch-tasks">
        {sortedCurrentTasks.map(([name, status]) => (
          <Checkbox
            data-cy="task-checkbox"
            key={name}
            onChange={onClickCheckbox(name)}
            label={name}
            indeterminate={status === CheckboxState.INDETERMINITE}
            checked={status === CheckboxState.CHECKED}
          />
        ))}
      </TaskLayoutGrid>
      {shorthandChildPatchesAndAliases && (
        <>
          <Body>Downstream Tasks</Body>
          <TaskLayoutGrid>
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
          </TaskLayoutGrid>
        </>
      )}
      {enumerateChildPatchTasks && (
        <>
          {currentChildPatches[0].variantsTasks.map((variantTasks) => (
            <VariantTasksList
              {...variantTasks}
              key={variantTasks.name}
              data-cy="child-patch-task-checkbox"
              status={CheckboxState.CHECKED}
            />
          ))}
        </>
      )}
      {enumerateAliasTasks && (
        <>
          {currentAliasTasks[0].variantsTasks.map(
            ({ name, tasks: aliasTasks }) => (
              <VariantTasksList
                key={name}
                data-cy="alias-task-checkbox"
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

const getSelectAllCheckboxState = (
  buildVariants: {
    [task: string]: CheckboxState;
  },
  aliases: {
    [alias: string]: CheckboxState;
  },
  enumerateChildPatchTasks: boolean
): CheckboxState => {
  if (enumerateChildPatchTasks) {
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
  childPatches: ChildPatchAliased[],
  selectedBuildVariants: string[]
): ChildPatchAliased[] => {
  if (!childPatches) {
    return [];
  }

  return childPatches.filter(({ alias }) =>
    selectedBuildVariants.includes(alias)
  );
};

interface DeduplicateTasksResult {
  [task: string]: CheckboxState;
}
const deduplicateTasks = (
  currentTasks: {
    [task: string]: boolean;
  }[]
): DeduplicateTasksResult => {
  const visibleTasks: DeduplicateTasksResult = {};
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
  margin-bottom: ${size.xs};
  display: flex;
  align-items: center;
  & > :first-of-type {
    margin-right: 40px;
  }
  & > :not(:first-of-type) {
    margin-right: ${size.m};
  }
`;

const StyledDisclaimer = styled(Disclaimer)`
  margin-bottom: ${size.xs};
`;
const cardSidePadding = css`
  padding-left: ${size.xs};
  padding-right: ${size.xs};
`;
const TabContentWrapper = styled.div`
  ${cardSidePadding}
`;

const IconContainer = styled.span`
  margin-left: ${size.xs};
`;
// @ts-expect-error
const InlineCheckbox = styled(Checkbox)`
  display: inline-flex;
`;
