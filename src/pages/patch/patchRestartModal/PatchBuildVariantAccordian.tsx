import React from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Accordian } from "components/Accordian";
import Badge from "components/Badge";
import { selectedStrings } from "hooks/usePatchStatusSelect";
import { PatchStatusCheckboxContainer } from "./PatchStatusCheckboxContainer";

interface PatchBuildVariantAccordianProps {
  tasks: {
    id: string;
    status: string;
    baseStatus?: string;
    displayName: string;
  }[];
  displayName: string;
  selectedTasks: selectedStrings;
  toggleSelectedTask: (id: string | string[]) => void;
}
export const PatchBuildVariantAccordian: React.FC<PatchBuildVariantAccordianProps> = ({
  tasks,
  displayName,
  selectedTasks,
  toggleSelectedTask,
}) => {
  const taskLength = tasks.length;
  const matchingTasks = countMatchingTasks(tasks, selectedTasks);
  const variantTitle = (
    <>
      <Checkbox
        data-cy="variant-checkbox-select-all"
        onChange={() => toggleSelectedTask(tasks.map((task) => task.id))}
        label={displayName}
        checked={matchingTasks === taskLength}
        indeterminate={matchingTasks > 0 && matchingTasks !== taskLength}
        bold
      />
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
  tasks: { id: string }[],
  selectedTasks: selectedStrings
): number => {
  let matchingTasks = 0;
  tasks.forEach((task) => {
    if (selectedTasks[task.id]) {
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
