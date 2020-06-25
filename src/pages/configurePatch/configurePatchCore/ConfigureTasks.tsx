import React from "react";
import styled from "@emotion/styled/macro";
import { Disclaimer } from "@leafygreen-ui/typography";
import { ProjectBuildVariant } from "gql/generated/types";
import { VariantTasksState } from "pages/configurePatch/ConfigurePatchCore";
import Checkbox from "@leafygreen-ui/checkbox";
import { css } from "@emotion/core";
import isEmpty from "lodash/isEmpty";
import { Button } from "components/Button";
import get from "lodash/get";

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
  const buildVariantCount = Object.keys(selectedVariantTasks).length;
  const taskCount = Object.values(selectedVariantTasks).reduce(
    (accum, taskObj) => accum + Object.values(taskObj).filter((v) => v).length,
    0
  );

  const currentTasks = Array.from(
    new Set(
      variants
        .filter((v) => selectedBuildVariant.includes(v.name))
        .reduce((accum, { tasks }) => [...accum, ...tasks], [])
    )
  );
  console.log({ selectedBuildVariant });
  const onClickSelectAll = () => {
    setSelectedVariantTasks(
      selectedBuildVariant.reduce(
        getSetAllCb(true, variants),
        selectedVariantTasks
      )
    );
  };

  const onClickDeselectAll = (): void => {
    setSelectedVariantTasks(
      selectedBuildVariant.reduce(
        getSetAllCb(false, variants),
        selectedVariantTasks
      )
    );
  };

  const onChangeCheckbox = (taskName: string): void => {
    const valueToSet =
      getTaskCheckboxState(
        taskName,
        selectedBuildVariant,
        selectedVariantTasks
      ) === "unchecked";
    setSelectedVariantTasks(
      selectedBuildVariant.reduce(
        (accum, buildVariantName) => ({
          ...accum,
          [buildVariantName]: {
            ...(accum[buildVariantName] ?? {}),
            [taskName]: valueToSet,
          },
        }),
        selectedVariantTasks
      )
    );
  };

  const selectAllCheckboxState = getSelectAllCheckboxState(
    selectedBuildVariant,
    selectedVariantTasks,
    variants
  );
  return (
    <TabContentWrapper>
      <Actions>
        <Button
          dataCy="schedule-patch"
          variant="primary"
          onClick={onClickSchedule}
          disabled={isEmpty(selectedVariantTasks) || loading}
          loading={loading}
        >
          Schedule
        </Button>
        <Checkbox
          data-cy="configurePatch-selectAll"
          data-checked={selectAllCheckboxState === "checked"}
          indeterminate={selectAllCheckboxState === "indeterminate"}
          onChange={onClickSelectAll}
          label="Select All"
          checked={selectAllCheckboxState === "checked"}
        />
        <Checkbox
          data-cy="configurePatch-deselectAll"
          data-checked={selectAllCheckboxState === "unchecked"}
          indeterminate={selectAllCheckboxState === "indeterminate"}
          onChange={onClickDeselectAll}
          label="Deselect All"
          checked={selectAllCheckboxState === "unchecked"}
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
            selectedVariantTasks
          );
          const isChecked = checkboxState === "checked";
          return (
            <Checkbox
              data-cy={`configurePatch-${task}`}
              data-checked={isChecked}
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
  selectedBuildVariantTasks: VariantTasksState
): CheckboxState => {
  const checkedCb = (allChecked: boolean, buildVariantName: string) =>
    allChecked &&
    get(selectedBuildVariantTasks, `[${buildVariantName}][${taskName}]`, false);
  const uncheckedCb = (allUnchecked: boolean, buildVariantName: string) =>
    allUnchecked &&
    !get(
      selectedBuildVariantTasks,
      `[${buildVariantName}][${taskName}]`,
      false
    );
  // @ts-ignore
  const checked: boolean = selectedBuildVariants.reduce(checkedCb, true);
  const unchecked: boolean = selectedBuildVariants.reduce(uncheckedCb, true);
  if (checked) {
    return "checked";
  }
  if (unchecked) {
    return "unchecked";
  }
  return "indeterminate";
};

const getSetAllCb = (value: boolean, variants: ProjectBuildVariant[]) => (
  variantAccum,
  buildVariantName
) => ({
  variantAccum,
  [buildVariantName]: get(
    variants.find(({ name }) => name === buildVariantName),
    "tasks",
    []
  ).reduce(
    (taskObAccum, taskName) => ({
      // @ts-ignore
      ...taskObAccum,
      [taskName]: value,
    }),
    // @ts-ignore
    {}
  ),
});

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
          variants.find(({ displayName }) => displayName === buildVariantName),
          "tasks",
          []
        ).length
    );
  };
  const uncheckedCb = (allUnchecked: boolean, buildVariantName: string) =>
    allUnchecked &&
    Object.values(get(selectedBuildVariantTasks, buildVariantName, {})).reduce(
      (allTasksUnchecked, taskVal) => allTasksUnchecked && !taskVal,
      true
    );

  const checked: boolean = selectedBuildVariants.reduce(checkedCb, true);
  const unchecked: boolean = selectedBuildVariants.reduce(uncheckedCb, true);
  if (checked) {
    return "checked";
  }
  if (unchecked) {
    return "unchecked";
  }
  return "indeterminate";
};
