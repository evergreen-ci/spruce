import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { uiColors } from "@leafygreen-ui/palette";
import { Disclaimer } from "@leafygreen-ui/typography";
import { TaskQueueDistro } from "gql/generated/types";

const { blue } = uiColors;

interface DistroOptionProps {
  option: TaskQueueDistro;
  onClick: (val: TaskQueueDistro) => void;
}

export const DistroOption: React.FC<DistroOptionProps> = ({
  option,
  onClick,
}) => {
  const { taskCount, hostCount, id } = option;
  return (
    <OptionWrapper onClick={() => onClick(option)}>
      <StyledBadge>{`${option.taskCount} ${
        taskCount === 1 ? "TASK" : "TASKS"
      }`}</StyledBadge>
      <StyledBadge>{`${hostCount} ${
        hostCount === 1 ? "HOST" : "HOSTS"
      }`}</StyledBadge>
      <DistroName>{id}</DistroName>
    </OptionWrapper>
  );
};

const OptionWrapper = styled.div`
  display: flex;
  padding: 8px;
  max-height: 500px;
  overflow-y: scroll;
  &:hover {
    cursor: pointer;
    background-color: ${blue.light3};
  }
`;
const StyledBadge = styled(Badge)`
  margin-right: 8px;
`;
const DistroName = styled(Disclaimer)`
  margin-left: 16px;
`;
