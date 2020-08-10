import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import Checkbox from "@leafygreen-ui/checkbox";
import { Accordian } from "components/Accordian";
import { PatchBuildVariantTask } from "gql/generated/types";
import { selectedStrings } from "hooks/usePatchStatusSelect";
import { PatchStatusCheckboxContainer } from "./PatchStatusCheckboxContainer";

interface PatchBuildVariantAccordianProps {
  tasks: PatchBuildVariantTask[];
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
        data-cy="task-status-checkbox"
        onChange={() => toggleSelectedTask(tasks.map((task) => task.id))}
        label={displayName}
        checked={matchingTasks === taskLength}
        indeterminate={matchingTasks > 0 && matchingTasks !== taskLength}
        bold={false}
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
  tasks: PatchBuildVariantTask[],
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
