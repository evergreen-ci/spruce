import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { TaskStatus } from "types/task";

interface HistoryTableIconProps {
  status: TaskStatus;
  label?: string;
  failingTests?: string[];
  inactive?: boolean;
  onClick?: () => void;
}

export const HistoryTableIcon: React.FC<HistoryTableIconProps> = ({
  status,
  label,
  failingTests = [],
  inactive,
  onClick,
}) => (
  <Tooltip
    usePortal={false}
    align="right"
    justify="middle"
    enabled={!inactive && !!failingTests.length}
    popoverZIndex={1}
    trigger={
      <Container onClick={onClick}>
        <IconContainer inactive={inactive}>
          <TaskStatusIcon status={status} />
        </IconContainer>
        {!inactive && <Body>{label}</Body>}
      </Container>
    }
    triggerEvent="hover"
  >
    <TestNameContainer>
      {failingTests.map((testName, key) => (
        <Body key={key}>{testName}</Body> // eslint-disable-line react/no-array-index-key
      ))}
    </TestNameContainer>
  </Tooltip>
);

const TestNameContainer = styled.div`
  white-space: nowrap;
`;

interface ContainerProps {
  onClick?: () => void;
}
const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ onClick }) => onClick && "cursor: pointer;"}
`;

interface IconContainerProps {
  inactive?: boolean;
}
const IconContainer = styled.div<IconContainerProps>`
  ${({ inactive }) => inactive && "opacity: .4;"}
`;
