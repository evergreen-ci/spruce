import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { TaskStatus } from "types/task";

interface FailingTest {
  testName: string;
  testId: string;
}

interface HistoryTableIconProps {
  status: TaskStatus;
  label?: string;
  failingTests?: FailingTest[];
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
  <ConditionalWrapper
    condition={inactive || failingTests.length > 0}
    wrapper={(children) => (
      <Tooltip
        usePortal={false}
        align="right"
        justify="middle"
        enabled={!inactive && !!failingTests.length}
        popoverZIndex={1}
        trigger={children}
        triggerEvent="hover"
      >
        <TestNameContainer>
          {failingTests.map(({ testName, testId }) => (
            <Body key={testId}>{testName}</Body>
          ))}
        </TestNameContainer>
      </Tooltip>
    )}
  >
    <Container onClick={() => onClick()} data-cy="history-table-icon">
      <IconContainer inactive={inactive}>
        <TaskStatusIcon status={status} size={30} />
      </IconContainer>
      {!inactive && <Body>{label}</Body>}
    </Container>
  </ConditionalWrapper>
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
  height: 30px;
  width: 30px;
  text-align: center;
  ${({ inactive }) => inactive && "opacity: .4;"}
`;
