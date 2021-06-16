import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Select } from "antd";
import { Square } from "components/StatusSquare";
import { P1 } from "components/Typography";
import { mapTaskStatusToColor } from "constants/task";
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
          <StyledSquare color={mapTaskStatusToColor[singleExecution.status]} />
          <StyledP1>
            {" "}
            Execution {executionAsDisplay(singleExecution.execution)} -{" "}
            {shortDate(
              singleExecution.activatedTime ?? singleExecution.ingestTime
            )}
          </StyledP1>
        </Option>
      ))}
    </StyledSelect>
  );
};

const StyledSelect = styled(Select)`
  margin-bottom: 10px;
  width: 100%;
`;
const StyledSquare = styled(Square)`
  float: left;
  width: 17px;
  height: 17px;
  margin-right: 3px;
`;
const StyledP1 = styled(P1)`
  font-size: 14px;
  float: left;
`;
