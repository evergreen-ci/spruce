import React, { useMemo, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body, Disclaimer } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
import Icon from "components/Icon";
import TextInput from "components/TextInputWithValidation";
import { CharKey } from "constants/keys";
import { size } from "constants/tokens";
import { VariantTask } from "gql/generated/types";
import useKeyboardShortcut from "hooks/useKeyboardShortcut";
import { validateRegexp } from "utils/validators";
import {
  AliasState,
  ChildPatchAliased,
  PatchTriggerAlias,
  VariantTasksState,
} from "../useConfigurePatch/types";
import DisabledVariantTasksList from "./DisabledVariantTasksList";
import { TaskLayoutGrid } from "./styles";
import { CheckboxState } from "./types";
import {
  deduplicateTasks,
  getSelectAllCheckboxState,
  getVisibleAliases,
  getVisibleChildPatches,
  isTaskCheckboxChecked,
  isTaskCheckboxActivated,
  isTaskCheckboxIndeterminate,
} from "./utils";

interface Props {
  selectedBuildVariants: string[];
  selectedBuildVariantTasks: VariantTasksState;
  setSelectedBuildVariantTasks: (vt: VariantTasksState) => void;
  activatedVariants?: VariantTask[];
  activated: boolean;
  selectedAliases: AliasState;
  setSelectedAliases: (aliases: AliasState) => void;
  childPatches: ChildPatchAliased[];
  selectableAliases: PatchTriggerAlias[];
  totalSelectedTaskCount: number;
  aliasCount: number;
}

const ConfigureTasks: React.FC<Props> = ({
  activated,
  activatedVariants = [],
  aliasCount,
  childPatches,
  selectableAliases,
  selectedAliases,
  selectedBuildVariantTasks,
  selectedBuildVariants,
  setSelectedAliases,
  setSelectedBuildVariantTasks,
  totalSelectedTaskCount,
}) => {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  useKeyboardShortcut(
    {
      charKey: CharKey.ForwardSlash,
    },
    () => {
      searchRef.current?.focus();
    },
  );

  const childPatchCount = childPatches?.length || 0;
  const totalDownstreamTaskCount = aliasCount + childPatchCount;

  const totalSelectedBuildVariantCount = Object.values(
    selectedBuildVariantTasks,
  ).reduce(
    (count, tasks) =>
      count + (Object.values(tasks).some((isSelected) => isSelected) ? 1 : 0),
    0,
  );

  // Deduplicate tasks across selected build variants
  const visibleTasks = useMemo(() => {
    const tasks = selectedBuildVariants.map(
      (bv) => selectedBuildVariantTasks[bv] || {},
    );
    const previouslySelectedVariants = selectedBuildVariants.map(
      (bv) => activatedVariants.find((vt) => vt.name === bv) || undefined,
    );
    return deduplicateTasks(
      tasks,
      previouslySelectedVariants,
      new RegExp(search),
    );
  }, [
    selectedBuildVariantTasks,
    selectedBuildVariants,
    activatedVariants,
    search,
  ]);

  // Sort tasks alphabetically
  const sortedVisibleTasks = useMemo(
    () => Object.entries(visibleTasks).sort((a, b) => a[0].localeCompare(b[0])),
    [visibleTasks],
  );

  const currentAliases = getVisibleAliases(
    selectedAliases,
    selectedBuildVariants,
  );
  const currentAliasTasks = selectableAliases.filter(({ alias }) =>
    selectedBuildVariants.includes(alias),
  );
  // Show an alias's variants/tasks if it is the only menu item selected
  const shouldShowAliasTasks =
    currentAliasTasks.length === 1 && selectedBuildVariants.length === 1;

  const currentChildPatches = getVisibleChildPatches(
    childPatches,
    selectedBuildVariants,
  );
  // Show a child patch's variants/tasks if it is the only menu item selected
  const shouldShowChildPatchTasks =
    currentChildPatches.length === 1 && selectedBuildVariants.length === 1;

  // Only show name of alias or child patch (no variants/tasks) if other build variants are also selected
  const shouldShowChildPatchesAndAliases =
    (Object.entries(currentAliases).length > 0 ||
      currentChildPatches.length > 0) &&
    selectedBuildVariants.length > 1;

  const onClickCheckbox =
    (taskName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
          if (search !== "" && !task.includes(search)) return;
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
    visibleTasks,
    currentAliases,
    shouldShowChildPatchTasks,
  );

  const variantHasActivatedTasks = sortedVisibleTasks.some((t) =>
    isTaskCheckboxActivated(t[1]),
  );

  const taskDisclaimerCopy = `${totalSelectedTaskCount} ${pluralize(
    "task",
    totalSelectedTaskCount,
  )} across ${totalSelectedBuildVariantCount} build ${pluralize(
    "variant",
    totalSelectedBuildVariantCount,
  )}, ${totalDownstreamTaskCount} trigger ${pluralize("alias", aliasCount)}`;

  const selectAllCheckboxCopy = getSelectAllCheckboxCopy(
    selectedBuildVariants.length,
    sortedVisibleTasks.length,
    search.length > 0,
  );
  return (
    <TabContentWrapper>
      <Actions>
        <StyledTextInput
          aria-labelledby="search-tasks"
          onChange={(v) => setSearch(v)}
          placeholder="Search tasks regex"
          ref={searchRef}
          data-cy="task-filter-input"
          validator={validateRegexp}
        />
        <InlineCheckbox
          data-cy="select-all-checkbox"
          indeterminate={selectAllCheckboxState === CheckboxState.Indeterminate}
          onChange={onClickSelectAll}
          label={
            <LabelContainer>
              {selectAllCheckboxCopy}
              {shouldShowChildPatchTasks && (
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
              {variantHasActivatedTasks && (
                <Tooltip
                  justify="middle"
                  triggerEvent="hover"
                  trigger={
                    <IconContainer>
                      <Icon glyph="InfoWithCircle" />
                    </IconContainer>
                  }
                >
                  Some Tasks in{" "}
                  {pluralize("this", selectedBuildVariants.length)}{" "}
                  {pluralize("variant", selectedBuildVariants.length)} have
                  already been activated. To disable them visit the patch page.
                </Tooltip>
              )}
            </LabelContainer>
          }
          checked={selectAllCheckboxState === CheckboxState.Checked}
          disabled={
            (activated && Object.entries(currentAliases).length > 0) ||
            shouldShowChildPatchTasks
          }
        />
      </Actions>

      <StyledDisclaimer data-cy="selected-task-disclaimer">
        {taskDisclaimerCopy}
      </StyledDisclaimer>

      {/* Tasks */}
      <TaskLayoutGrid data-cy="configurePatch-tasks">
        {sortedVisibleTasks.map(([name, state]) => (
          <Checkbox
            data-cy="task-checkbox"
            key={name}
            onChange={onClickCheckbox(name)}
            label={name}
            indeterminate={isTaskCheckboxIndeterminate(state)}
            checked={isTaskCheckboxChecked(state)}
          />
        ))}
      </TaskLayoutGrid>

      {shouldShowChildPatchesAndAliases && (
        <>
          <Body>Downstream Tasks</Body>
          <TaskLayoutGrid>
            {Object.entries(currentAliases).map(([name, status]) => (
              <Checkbox
                data-cy="alias-checkbox"
                key={name}
                onChange={onClickCheckbox(name)}
                label={name}
                indeterminate={status === CheckboxState.Indeterminate}
                checked={status === CheckboxState.Checked}
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
      {shouldShowChildPatchTasks && (
        <DisabledVariantTasksList
          data-cy="child-patch-task-checkbox"
          status={CheckboxState.Checked}
          variantTasks={currentChildPatches[0].variantsTasks}
        />
      )}
      {shouldShowAliasTasks && (
        <DisabledVariantTasksList
          data-cy="alias-task-checkbox"
          status={currentAliases[currentAliasTasks[0].alias]}
          variantTasks={currentAliasTasks[0].variantsTasks}
        />
      )}
    </TabContentWrapper>
  );
};

const getSelectAllCheckboxCopy = (
  selectedBuildVariantsCount: number,
  sortedVisibleTaskCount: number,
  hasFilter: boolean,
) => {
  if (hasFilter) {
    return "Select all tasks in view";
  }

  return sortedVisibleTaskCount === 0
    ? `Add ${pluralize("alias", selectedBuildVariantsCount)} to patch`
    : `Select all tasks in ${pluralize(
        "this",
        selectedBuildVariantsCount,
      )} ${pluralize("variant", selectedBuildVariantsCount)}`;
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

const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const StyledDisclaimer = styled(Disclaimer)`
  margin-bottom: ${size.xs};
`;
const StyledTextInput = styled(TextInput)`
  width: 300px;
`;
const cardSidePadding = css`
  padding-left: ${size.xs};
  padding-right: ${size.xs};
`;
const TabContentWrapper = styled.div`
  ${cardSidePadding}
`;

const IconContainer = styled.div`
  margin-left: ${size.xs};
  align-self: center;
  display: flex;
`;
// @ts-expect-error
const InlineCheckbox = styled(Checkbox)`
  display: inline-flex;
`;

export default ConfigureTasks;
