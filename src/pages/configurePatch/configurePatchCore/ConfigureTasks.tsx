import React from "react";
import styled from "@emotion/styled/macro";
import { Disclaimer } from "@leafygreen-ui/typography";
import Button from "@leafygreen-ui/button";
import { ProjectVariants } from "gql/queries/patch";
import { VariantTasksState } from "pages/configurePatch/ConfigurePatchCore";
import Checkbox from "@leafygreen-ui/checkbox";
import { Skeleton } from "antd";
import { css } from "@emotion/core";

interface Props {
  variants: ProjectVariants;
  selectedBuildVariant: string;
  selectedVariantTasks: VariantTasksState;
  loading: boolean;
  setSelectedVariantTasks: React.Dispatch<
    React.SetStateAction<VariantTasksState>
  >;
}
interface TasksState {
  [task: string]: true;
}

export const ConfigureTasks: React.FC<Props> = ({
  variants,
  selectedBuildVariant,
  selectedVariantTasks,
  loading,
  setSelectedVariantTasks,
}) => {
  if (loading) {
    return <Skeleton active={true} title={true} paragraph={{ rows: 8 }} />;
  }
  const projectVariantTasksMap: {
    [variant: string]: string[];
  } = variants.reduce((prev, { name, tasks }) => {
    prev[name] = tasks;
    return prev;
  }, {});
  const currentTasks =
    projectVariantTasksMap[selectedBuildVariant || variants[0].name];

  const taskCount = Object.values(selectedVariantTasks).reduce(
    (prev, curr) => prev + Object.values(curr).length,
    0
  );
  const buildVariantCount = Object.keys(selectedVariantTasks).length;

  const onClickSelectAll = () => {
    const allTasksForVariant: TasksState = currentTasks.reduce((prev, curr) => {
      prev[curr] = true;
      return prev;
    }, {});
    setSelectedVariantTasks({
      ...selectedVariantTasks,
      [selectedBuildVariant]: allTasksForVariant,
    });
  };
  const onClickDeselectAll = () => {
    const nextSelectedVariantTasks = { ...selectedVariantTasks };
    delete nextSelectedVariantTasks[selectedBuildVariant];
    setSelectedVariantTasks(nextSelectedVariantTasks);
  };
  const getTaskCheckboxChangeHandler = (task: string, variant: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = e.target;
    const nextVariantTasks = { ...selectedVariantTasks[variant] };
    if (checked) {
      setSelectedVariantTasks({
        ...selectedVariantTasks,
        [variant]: { ...nextVariantTasks, [task]: true },
      });
    } else {
      delete nextVariantTasks[task];
      setSelectedVariantTasks({
        ...selectedVariantTasks,
        [variant]: nextVariantTasks,
      });
    }
  };

  return (
    <TabContentWrapper>
      <Actions>
        <Button>Schedule</Button>
        <ButtonLink onClick={onClickSelectAll}>Select All</ButtonLink>
        <ButtonLink onClick={onClickDeselectAll}>Deselect All</ButtonLink>
      </Actions>
      <StyledDisclaimer>
        {`${taskCount} task${
          taskCount !== 1 ? "s" : ""
        } across ${buildVariantCount} build variant${
          buildVariantCount !== 1 ? "s" : ""
        }`}
      </StyledDisclaimer>
      <Tasks>
        {currentTasks.map((task) => {
          const checked =
            !!selectedVariantTasks[selectedBuildVariant] &&
            selectedVariantTasks[selectedBuildVariant][task] === true;
          return (
            <Checkbox
              key={task}
              data-cy="variant-task"
              onChange={getTaskCheckboxChangeHandler(
                task,
                selectedBuildVariant
              )}
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
  & > :first-child {
    margin-right: 40px;
  }
  & > :not(:first-child) {
    margin-right: 24px;
  }
`;
const Tasks = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto auto;
  grid-template-areas: "a a";
  grid-auto-rows: auto;
  grid-column-gap: 80px;
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
