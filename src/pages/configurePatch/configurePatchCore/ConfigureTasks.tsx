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

  const onClickSelectAll = () => {
    // const variantTasks = selectedBuildVariant.map((buildVariant) =>
    //   variants.filter(v ).find((element) => element.name === buildVariant)
    // );
    // const checkAllTasks = (tasks: string[]) => {
    //   const checkedTasks = {};
    //   for (let i = 0; i < tasks.length; i++) {
    //     checkedTasks[tasks[i]] = true;
    //   }
    //   return checkedTasks;
    // };
    // const selectedTasks = {};
    // for (let i = 0; i < variantTasks.length; i++) {
    //   selectedTasks[variantTasks[i].name] = checkAllTasks(
    //     variantTasks[i].tasks
    //   );
    // }
    // setSelectedVariantTasks({ ...selectedVariantTasks, ...selectedTasks });
  };

  const onClickDeselectAll = (): void => {
    const tempSelectedVariantTasks = { ...selectedVariantTasks };
    for (let i = 0; i < selectedBuildVariant.length; i++) {
      delete tempSelectedVariantTasks[selectedBuildVariant[i]];
    }
    setSelectedVariantTasks({ ...tempSelectedVariantTasks });
  };
  const onChangeCheckbox = (taskName: string): void => {
    const valueToSet =
      getCheckboxState(taskName, selectedBuildVariant, selectedVariantTasks) ===
      "unchecked";
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
        <ButtonLink
          data-cy="configurePatch-selectAll"
          onClick={onClickSelectAll}
        >
          Select All
        </ButtonLink>
        <ButtonLink
          data-cy="configurePatch-deselectAll"
          onClick={onClickDeselectAll}
        >
          Deselect All
        </ButtonLink>
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
          const checkboxState = getCheckboxState(
            task,
            selectedBuildVariant,
            selectedVariantTasks
          );
          const checked = checkboxState === "checked";
          return (
            <Checkbox
              data-cy={`configurePatch-${task}`}
              data-checked={checked}
              key={task}
              indeterminate={checkboxState === "indeterminate"}
              onChange={() => onChangeCheckbox(task)}
              label={task}
              checked={checked}
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
const ButtonLink = styled.div`
  cursor: pointer;
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

const getCheckboxState = (
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
