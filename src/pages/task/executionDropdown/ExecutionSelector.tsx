import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { Select } from "antd";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { fontSize, size } from "constants/tokens";
import {
  GetTaskAllExecutionsQuery,
  GetTaskAllExecutionsQueryVariables,
} from "gql/generated/types";
import { GET_TASK_ALL_EXECUTIONS } from "gql/queries";
import { useDateFormat } from "hooks";
import { executionAsDisplay } from "pages/task/util/execution";

interface ExecutionSelectProps {
  id: string;
  currentExecution: number;
  latestExecution: number | null;
  updateExecution: (execution: number) => void;
}

export const ExecutionSelect: React.VFC<ExecutionSelectProps> = ({
  id,
  currentExecution,
  latestExecution,
  updateExecution,
}) => {
  const allExecutionsResult = useQuery<
    GetTaskAllExecutionsQuery,
    GetTaskAllExecutionsQueryVariables
  >(GET_TASK_ALL_EXECUTIONS, {
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
      value={`Execution ${executionAsDisplay(currentExecution)}${
        currentExecution === latestExecution ? " (latest)" : ""
      }`}
      onChange={(selected: number | null) => {
        updateExecution(selected);
      }}
    >
      {allExecutions?.map((singleExecution) => {
        const optionText = `Execution ${executionAsDisplay(
          singleExecution.execution
        )} - ${getDateCopy(
          singleExecution.activatedTime ?? singleExecution.ingestTime
        )}`;

        return (
          <Option
            key={singleExecution.execution}
            value={singleExecution.execution}
            data-cy={`execution-${singleExecution.execution}`}
          >
            <ExecutionInfo>
              <StyledTaskStatusIcon status={singleExecution.status} />
              <StyledBody>{optionText}</StyledBody>
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

const StyledBody = styled(Body)`
  font-size: ${fontSize.m};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const StyledTaskStatusIcon = styled(TaskStatusIcon)`
  margin-right: ${size.xxs};
  flex-shrink: 0;
`;
