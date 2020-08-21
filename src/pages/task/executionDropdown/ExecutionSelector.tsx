import React from "react";
import styled from "@emotion/styled";
import { shortDate } from "utils/string";
import { Select } from "antd";
import { useQuery } from "@apollo/client";
import { ExecutionAsDisplay } from "pages/task/util/execution";
import {
  GetTaskAllExecutionsQuery,
  GetTaskAllExecutionsQueryVariables,
} from "gql/generated/types";
import { P1 } from "components/Typography";
import { GET_TASK_ALL_EXECUTIONS } from "gql/queries";
import { mapVariantTaskStatusToColor, Square } from "components/StatusSquare";

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
      data-test-id="execution-select"
      value={`Execution ${ExecutionAsDisplay(currentExecution)}${
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
          data-test-id={`execution-${singleExecution.execution}`}
        >
          <StyledSquare
            color={mapVariantTaskStatusToColor[singleExecution.status]}
          />
          <StyledP1>
            {" "}
            Execution {ExecutionAsDisplay(singleExecution.execution)} -{" "}
            {shortDate(singleExecution.createTime)}
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
  float: left;
`;
