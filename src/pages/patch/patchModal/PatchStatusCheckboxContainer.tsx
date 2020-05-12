import React from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { PatchBuildVariantTask } from "gql/generated/types";
import {
  mapVariantTaskStatusToColor,
  Square,
} from "pages/patch/buildVariants/variantColors";

interface PatchStatusCheckboxContainerProps {
  tasks: PatchBuildVariantTask[];
  selectedTasks: string[];
  toggleSelectedTask: (id: string) => void;
}
export const PatchStatusCheckboxContainer: React.FC<PatchStatusCheckboxContainerProps> = ({
  tasks,
  selectedTasks,
  toggleSelectedTask,
}) => (
  <ScrollableContainer data-cy="patch-status-selector-container">
    {tasks.map((task) => (
      <Checkbox
        data-cy="task-status-checkbox"
        onChange={() => toggleSelectedTask(task.id)}
        label={
          <PatchStateItemWrapper>
            <PaddedSquare color={mapVariantTaskStatusToColor[task.status]} />{" "}
            {task.name}
          </PatchStateItemWrapper>
        }
        checked={selectedTasks.includes(task.id)}
        bold={false}
      />
    ))}
  </ScrollableContainer>
);

const PaddedSquare = styled(Square)`
  margin-right: 6px;
`;
const ScrollableContainer = styled("div")`
  max-height: 250px;
  overflow-y: scroll;
`;
const PatchStateItemWrapper = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
