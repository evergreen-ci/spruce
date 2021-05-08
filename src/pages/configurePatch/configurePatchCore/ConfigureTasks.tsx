import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Disclaimer } from "@leafygreen-ui/typography";
import every from "lodash.every";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { Button } from "components/Button";
import { ProjectBuildVariant } from "gql/generated/types";
import { VariantTasksState } from "pages/configurePatch/ConfigurePatchCore";

interface Props {
  variants: ProjectBuildVariant[];
  selectedBuildVariant: string[];
  selectedVariantTasks: VariantTasksState;
  setSelectedVariantTasks: React.Dispatch<
    React.SetStateAction<VariantTasksState>
  >;
  loading: boolean;
  onClickSchedule: () => void;
}

export const ConfigureTasks: React.FC<Props> = ({
  variants,
  selectedBuildVariant,
  selectedVariantTasks,
  setSelectedVariantTasks,
  loading,
  onClickSchedule,
}) => {
  const buildVariantCount = Object.values(selectedVariantTasks).reduce(
    (count, taskOb) =>
      count +
      (every(Object.values(taskOb), (isSelected) => !isSelected) ? 0 : 1),
    0
  );
  const taskCount = Object.values(selectedVariantTasks).reduce(
    (count, taskObj) => count + Object.values(taskObj).filter((v) => v).length,
    0
  );
  // represents tasks from selected build variants
  const currentTasks = Array.from(
    new Set(
      variants
        .filter((v) => selectedBuildVariant.includes(v.name))
        .reduce<string[]>((accum, { tasks }) => [...accum, ...tasks], [])
    )
  );

  const onChangeCheckbox = (taskName: string): void => {
    const valueToSet =
      getTaskCheckboxState(
        taskName,
        selectedBuildVariant,
        selectedVariantTasks,
        variants
      ) === "unchecked";

    setSelectedVariantTasks(
      selectedBuildVariant.reduce((accum, buildVariantName) => {
        const variantHasTask = taskExistsInVariant(
          taskName,
          buildVariantName,
          variants
        );
        return variantHasTask
          ? {
              ...accum,
              [buildVariantName]: {
                ...(accum[buildVariantName] ?? {}),
                [taskName]: valueToSet,
              },
            }
          : accum;
      }, selectedVariantTasks)
    );
  };

  const selectAllCheckboxState = getSelectAllCheckboxState(
    selectedBuildVariant,
    selectedVariantTasks,
    variants
  );

  const selectAllCheckboxCopy = `Select all tasks in ${
    selectedBuildVariant.length > 1 ? "these variants" : "this variant"
  }`;

  const onClickSelectAll = () => {
    setSelectedVariantTasks(
      selectedBuildVariant.reduce(
        getSetAllCb(selectAllCheckboxState !== "checked", variants),
        selectedVariantTasks
      )
    );
  };

  return (
    <TabContentWrapper>
      <Actions>
        <Button
          data-cy="schedule-patch"
          variant="primary"
          onClick={onClickSchedule}
          disabled={isEmpty(selectedVariantTasks) || loading}
          loading={loading}
        >
          Schedule
        </Button>
        <Checkbox
          data-cy="configurePatch-selectAll"
          data-checked={`selectAll-${selectAllCheckboxState}`}
          indeterminate={selectAllCheckboxState === "indeterminate"}
          onChange={onClickSelectAll}
          label={selectAllCheckboxCopy}
          checked={selectAllCheckboxState === "checked"}
        />
      </Actions>
      <StyledDisclaimer data-cy="x-tasks-across-y-variants">
        {`${taskCount} task${
          taskCount !== 1 ? "s" : ""
        } across ${buildVariantCount} build variant${
          buildVariantCount !== 1 ? "s" : ""
        }`}
      </StyledDisclaimer>
      <Tasks data-cy="configurePatch-tasks">
        {currentTasks.map((task) => {
          const checkboxState = getTaskCheckboxState(
            task,
            selectedBuildVariant,
            selectedVariantTasks,
            variants
          );
          const isChecked = checkboxState === "checked";
          return (
            <Checkbox
              data-cy={`configurePatch-${task}`}
              data-checked={`task-checkbox-${checkboxState}`}
              data-name-checked={`task-checkbox-${task}-${checkboxState}`}
              key={task}
              indeterminate={checkboxState === "indeterminate"}
              onChange={() => onChangeCheckbox(task)}
              label={task}
              checked={isChecked}
            />
          );
        })}
      </Tasks>
    </TabContentWrapper>
  );
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

type CheckboxState = "checked" | "unchecked" | "indeterminate";

const getTaskCheckboxState = (
  taskName: string,
  selectedBuildVariants: string[],
  selectedBuildVariantTasks: VariantTasksState,
  variants: ProjectBuildVariant[]
): CheckboxState => {
  const checkedCb = (
    allChecked: boolean,
    buildVariantName: string
  ): boolean => {
    const isTaskSelected =
      selectedBuildVariantTasks[buildVariantName] &&
      selectedBuildVariantTasks[buildVariantName][taskName];
    return allChecked && isTaskSelected;
  };
  const checked: boolean = selectedBuildVariants
    .filter((buildVariantName) =>
      taskExistsInVariant(taskName, buildVariantName, variants)
    )
    .reduce(checkedCb, true);

  if (checked) {
    return "checked";
  }

  const uncheckedCb = (allUnchecked: boolean, buildVariantName: string) => {
    const isTaskSelected =
      selectedBuildVariantTasks[buildVariantName] &&
      selectedBuildVariantTasks[buildVariantName][taskName];
    return allUnchecked && !isTaskSelected;
  };
  const unchecked: boolean = selectedBuildVariants.reduce(uncheckedCb, true);

  if (unchecked) {
    return "unchecked";
  }

  return "indeterminate";
};

const getSetAllCb = (value: boolean, variants: ProjectBuildVariant[]) => (
  variantAccum,
  buildVariantName: string
) => {
  const allTasks: string[] = get(
    variants.find(({ name }) => name === buildVariantName),
    "tasks",
    []
  );

  const tasks = allTasks.reduce(
    (taskObAccum, taskName) => ({
      ...taskObAccum,
      [taskName]: value,
    }),
    {}
  );

  return {
    ...variantAccum,
    [buildVariantName]: tasks,
  };
};

const getSelectAllCheckboxState = (
  selectedBuildVariants: string[],
  selectedBuildVariantTasks: VariantTasksState,
  variants: ProjectBuildVariant[]
): CheckboxState => {
  const checkedCb = (allChecked: boolean, buildVariantName: string) => {
    const buildVariantTasksValues = Object.values(
      get(selectedBuildVariantTasks, buildVariantName, {})
    );
    return (
      allChecked &&
      buildVariantTasksValues.reduce(
        (allTasksChecked, taskVal) => allTasksChecked && taskVal,
        true
      ) &&
      buildVariantTasksValues.length ===
        get(
          variants.find(({ name }) => name === buildVariantName),
          "tasks",
          []
        ).length
    );
  };
  const checked: boolean = selectedBuildVariants.reduce(checkedCb, true);

  if (checked) {
    return "checked";
  }

  const uncheckedCb = (allUnchecked: boolean, buildVariantName: string) =>
    allUnchecked &&
    Object.values(get(selectedBuildVariantTasks, buildVariantName, {})).reduce(
      (allTasksUnchecked, taskVal) => allTasksUnchecked && !taskVal,
      true
    );
  const unchecked: boolean = selectedBuildVariants.reduce(uncheckedCb, true);

  if (unchecked) {
    return "unchecked";
  }

  return "indeterminate";
};

const taskExistsInVariant = (
  taskName: string,
  variantName: string,
  allVariants: ProjectBuildVariant[]
): boolean =>
  get(
    allVariants.find(({ name }) => name === variantName),
    "tasks",
    []
  ).includes(taskName);
