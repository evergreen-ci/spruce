import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import { Disclaimer } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { getTaskQueueRoute } from "constants/routes";
import { size } from "constants/tokens";
import { TaskQueueDistro } from "gql/generated/types";

const { blue } = palette;

interface DistroOptionProps {
  option: TaskQueueDistro;
  onClick: (val: TaskQueueDistro) => void;
}

export const DistroOption: React.VFC<DistroOptionProps> = ({
  option,
  onClick,
}) => {
  const { taskCount, hostCount, id } = option;
  return (
    <Link to={getTaskQueueRoute(id)} onClick={() => onClick(option)}>
      <OptionWrapper>
        <StyledBadge>{`${option.taskCount} ${
          taskCount === 1 ? "TASK" : "TASKS"
        }`}</StyledBadge>
        <StyledBadge>{`${hostCount} ${
          hostCount === 1 ? "HOST" : "HOSTS"
        }`}</StyledBadge>
        <DistroName>{id}</DistroName>
      </OptionWrapper>
    </Link>
  );
};

const OptionWrapper = styled.div`
  display: flex;
  padding: 10px 12px;
  align-items: start;
  &:hover {
    background-color: ${blue.light3};
  }
`;
const StyledBadge = styled(Badge)`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  width: 90px;
  margin-right: ${size.xs};
`;
const DistroName = styled(Disclaimer)`
  margin-left: ${size.s};
`;
