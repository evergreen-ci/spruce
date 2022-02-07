import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { size } from "constants/tokens";
import { TaskStatus } from "types/task";

interface HistoryTableIconProps {
  status: TaskStatus;
  label?: string;
  failingTests?: string[];
  inactive?: boolean;
  loadingTestResults?: boolean;
  onClick?: () => void;
}

export const HistoryTableIcon: React.FC<HistoryTableIconProps> = ({
  status,
  label,
  failingTests = [],
  inactive,
  loadingTestResults,
  onClick = () => {},
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
          {failingTests.map((testName) => (
            <TestName key={testName}>{testName}</TestName>
          ))}
          {loadingTestResults && <Skeleton active data-cy="skeleton" />}
        </TestNameContainer>
      </Tooltip>
    )}
  >
    <Container onClick={() => onClick()} data-cy="history-table-icon">
      <IconContainer>
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

const IconContainer = styled.div`
  height: ${size.l};
  width: ${size.l};
  text-align: center;
`;

const TestName = styled.div`
  word-break: break-all;
`;
