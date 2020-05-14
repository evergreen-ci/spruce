import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Body } from "@leafygreen-ui/typography";
import { Accordian } from "components/Accordian";
import { PatchBuildVariantTask } from "gql/generated/types";
import { PatchStatusCheckboxContainer } from "./PatchStatusCheckboxContainer";

interface PatchBuildVariantAccordianProps {
  tasks: PatchBuildVariantTask[];
  variant: string;
  selectedTasks: string[];
  toggleSelectedTask: (id: string) => void;
}
export const PatchBuildVariantAccordian: React.FC<PatchBuildVariantAccordianProps> = ({
  tasks,
  variant,
  selectedTasks,
  toggleSelectedTask,
}) => {
  const taskLength = tasks.length;
  const matchingTasks = countMatchingTasks(tasks, selectedTasks);
  const variantTitle = (
    <>
      <Body weight="medium">{variant}</Body>
      <BadgeWrapper>
        <Badge data-cy="task-status-badge">
          {matchingTasks} of {taskLength} Selected
        </Badge>
      </BadgeWrapper>
    </>
  );
  return (
    <AccordianWrapper data-cy="variant-accordian">
      <Accordian
        title={variantTitle}
        contents={
          <PatchStatusCheckboxContainer
            tasks={tasks}
            selectedTasks={selectedTasks}
            toggleSelectedTask={toggleSelectedTask}
          />
        }
      />
    </AccordianWrapper>
  );
};

const countMatchingTasks = (
  tasks: PatchBuildVariantTask[],
  selectedTasks: string[]
): number => {
  let matchingTasks = 0;
  tasks.forEach((task) => {
    if (selectedTasks.includes(task.id)) {
      matchingTasks += 1;
    }
  });
  return matchingTasks;
};

const AccordianWrapper = styled("div")`
  padding-bottom: 12px;
  padding-top: 12px;
`;

const BadgeWrapper = styled("div")`
  padding-left: 10px;
`;
