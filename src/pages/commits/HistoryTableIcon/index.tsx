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
}

export const HistoryTableIcon: React.FC<HistoryTableIconProps> = ({
  status,
  label,
  failingTests = [],
  inactive,
}) => (
  <Tooltip
    usePortal={false}
    align="right"
    justify="middle"
    enabled={!inactive && !!failingTests.length}
    popoverZIndex={1}
    trigger={
      <Container>
        <IconContainer inactive={inactive}>
          <TaskStatusIcon status={status} />
        </IconContainer>
        {!inactive && <Body>{label}</Body>}
      </Container>
    }
    triggerEvent="hover"
  >
    <TestNameContainer>
      {failingTests.map((testName) => (
        <Body>{testName}</Body>
      ))}
    </TestNameContainer>
  </Tooltip>
);

const TestNameContainer = styled.div`
  white-space: nowrap;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface IconContainerProps {
  inactive?: boolean;
}
const IconContainer = styled.div<IconContainerProps>`
  ${({ inactive }) => inactive && "opacity: .4;"}
  height: 30px;
  width: 30px;
`;
