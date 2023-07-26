import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import Checkbox from "@leafygreen-ui/checkbox";
import { Accordion } from "components/Accordion";
import { size } from "constants/tokens";
import { selectedStrings } from "hooks/useVersionTaskStatusSelect";
import { TaskStatusCheckboxContainer } from "./TaskStatusCheckboxContainer";

interface BuildVariantAccordionProps {
  versionId: string;
  tasks: {
    id: string;
    status: string;
    baseStatus?: string;
    displayName: string;
  }[];
  displayName: string;
  selectedTasks: selectedStrings;
  toggleSelectedTask: (
    taskIds: { [versionId: string]: string } | { [versionId: string]: string[] }
  ) => void;
}
export const BuildVariantAccordion: React.VFC<BuildVariantAccordionProps> = ({
  displayName,
  selectedTasks,
  tasks,
  toggleSelectedTask,
  versionId,
}) => {
  const taskLength = tasks.length;
  const matchingTasks = countMatchingTasks(tasks, selectedTasks);
  const variantTitle = (
    <>
      <Checkbox
        data-cy="variant-checkbox-select-all"
        onChange={() =>
          toggleSelectedTask({ [versionId]: tasks.map((task) => task.id) })
        }
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
    <Wrapper data-cy="variant-accordion">
      <Accordion title={variantTitle} titleTag={FlexContainer}>
        <TaskStatusCheckboxContainer
          versionId={versionId}
          tasks={tasks}
          selectedTasks={selectedTasks}
          toggleSelectedTask={toggleSelectedTask}
        />
      </Accordion>
    </Wrapper>
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

const BadgeWrapper = styled.div`
  padding-left: 10px;
`;

const Wrapper = styled.div`
  margin: ${size.xs} 0;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;
