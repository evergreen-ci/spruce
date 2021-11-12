import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Select } from "antd";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { P1 } from "components/Typography";
import {
  GetTaskAllExecutionsQuery,
  GetTaskAllExecutionsQueryVariables,
} from "gql/generated/types";
import { GET_TASK_ALL_EXECUTIONS } from "gql/queries";
import { executionAsDisplay } from "pages/task/util/execution";
import { string } from "utils";

const { shortDate } = string;
interface ExecutionSelectProps {
  id: string;
  currentExecution: number;
  latestExecution: number | null;
  updateExecution: (execution: number) => void;
}

export const ExecutionSelect: React.FC<ExecutionSelectProps> = ({
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
            <TaskStatusIcon status={singleExecution.status} rightMargin />
            <StyledP1>
              Execution {executionAsDisplay(singleExecution.execution)} -{" "}
              {shortDate(
                singleExecution.activatedTime ?? singleExecution.ingestTime
              )}
            </StyledP1>
          </Row>
        </Option>
      ))}
    </StyledSelect>
  );
};

const StyledSelect = styled(Select)`
  margin-bottom: 10px;
  width: 100%;
`;
const StyledP1 = styled(P1)`
  font-size: 14px;
`;

const Row = styled.div`
  display: flex;
`;
