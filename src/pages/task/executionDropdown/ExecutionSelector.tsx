import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { Select } from "antd";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { fontSize, size } from "constants/tokens";
import {
  TaskAllExecutionsQuery,
  TaskAllExecutionsQueryVariables,
} from "gql/generated/types";
import { TASK_ALL_EXECUTIONS } from "gql/queries";
import { useDateFormat } from "hooks";
import { formatZeroIndexForDisplay } from "utils/numbers";

interface ExecutionSelectProps {
  id: string;
  currentExecution: number;
  latestExecution: number | null;
  updateExecution: (execution: number) => void;
}

export const ExecutionSelect: React.FC<ExecutionSelectProps> = ({
  currentExecution,
  id,
  latestExecution,
  updateExecution,
}) => {
  const allExecutionsResult = useQuery<
    TaskAllExecutionsQuery,
    TaskAllExecutionsQueryVariables
  >(TASK_ALL_EXECUTIONS, {
    variables: { taskId: id },
  });
  const allExecutions = allExecutionsResult?.data?.taskAllExecutions;
  const executionsLoading = allExecutionsResult?.loading;
  const { Option } = Select;
  const getDateCopy = useDateFormat();
  return (
    <StyledSelect
      placeholder="Choose an execution"
      disabled={executionsLoading}
      key={currentExecution}
      data-cy="execution-select"
      value={`Execution ${formatZeroIndexForDisplay(currentExecution)}${
        currentExecution === latestExecution ? " (latest)" : ""
      }`}
      onChange={(selected: number | null) => {
        updateExecution(selected);
      }}
    >
      {allExecutions?.map((singleExecution) => {
        const optionText = `Execution ${formatZeroIndexForDisplay(
          singleExecution.execution,
        )} - ${getDateCopy(
          singleExecution.activatedTime ?? singleExecution.ingestTime,
          { omitTimezone: true },
        )}`;

        return (
          <Option
            key={singleExecution.execution}
            value={singleExecution.execution}
            data-cy={`execution-${singleExecution.execution}`}
          >
            <ExecutionInfo>
              <StyledTaskStatusIcon status={singleExecution.status} />
              {/* @ts-expect-error */}
              <StyledBody title={optionText}>{optionText}</StyledBody>
            </ExecutionInfo>
          </Option>
        );
      })}
    </StyledSelect>
  );
};

const StyledSelect = styled(Select)`
  margin-bottom: ${size.xs};
  width: 100%;
`;

const ExecutionInfo = styled.div`
  display: flex;
  align-items: center;
`;

const StyledBody = styled(Body)<BodyProps>`
  font-size: ${fontSize.m};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const StyledTaskStatusIcon = styled(TaskStatusIcon)`
  margin-right: ${size.xxs};
  flex-shrink: 0;
`;
