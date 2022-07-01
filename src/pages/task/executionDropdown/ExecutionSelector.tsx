import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Select } from "antd";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { P1 } from "components/Typography";
import { fontSize, size } from "constants/tokens";
import {
  GetTaskAllExecutionsQuery,
  GetTaskAllExecutionsQueryVariables,
} from "gql/generated/types";
import { GET_TASK_ALL_EXECUTIONS } from "gql/queries";
import { useUserTimeZone } from "hooks/useUserTimeZone";
import { executionAsDisplay } from "pages/task/util/execution";
import { getDateCopy } from "utils/string";

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
  const tz = useUserTimeZone();

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
      {allExecutions?.map((singleExecution) => (
        <Option
          key={singleExecution.execution}
          value={singleExecution.execution}
          data-cy={`execution-${singleExecution.execution}`}
        >
          <Row>
            <StyledTaskStatusIcon status={singleExecution.status} />
            <StyledP1>
              Execution {executionAsDisplay(singleExecution.execution)} -{" "}
              {getDateCopy(
                singleExecution.activatedTime ?? singleExecution.ingestTime,
                { tz }
              )}
            </StyledP1>
          </Row>
        </Option>
      ))}
    </StyledSelect>
  );
};

const StyledSelect = styled(Select)`
  margin-bottom: ${size.xs};
  width: 100%;
`;
const StyledP1 = styled(P1)`
  font-size: ${fontSize.m};
`;

const Row = styled.div`
  display: flex;
`;

const StyledTaskStatusIcon = styled(TaskStatusIcon)`
  margin-right: ${size.xxs};
`;
