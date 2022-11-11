import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Select, Option } from "@leafygreen-ui/select";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { size } from "constants/tokens";
import {
  GetTaskAllExecutionsQuery,
  GetTaskAllExecutionsQueryVariables,
} from "gql/generated/types";
import { GET_TASK_ALL_EXECUTIONS } from "gql/queries";
import { useDateFormat } from "hooks";
import { executionAsDisplay } from "pages/task/util/execution";
import { SelectType } from "types/leafygreen";

interface ExecutionSelectProps {
  id: string;
  currentExecution: number;
  latestExecution: number | null;
  updateExecution: (execution: string) => void;
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
  const getDateCopy = useDateFormat();
  return (
    <StyledSelect
      placeholder="Choose an execution"
      disabled={executionsLoading}
      key={currentExecution}
      data-cy="execution-select"
      value={`${currentExecution}`}
      onChange={(selected: string) => {
        updateExecution(selected);
      }}
      label="Execution"
      allowDeselect={false}
    >
      {allExecutions?.map((singleExecution) => {
        const optionText = `#${executionAsDisplay(
          singleExecution.execution
        )} – ${getDateCopy(
          singleExecution.activatedTime ?? singleExecution.ingestTime
        )}${singleExecution.execution === latestExecution ? " (latest)" : ""}`;

        return (
          <Option
            key={singleExecution.execution}
            value={`${singleExecution.execution}`}
            data-cy={`execution-${singleExecution.execution}`}
            glyph={<TaskStatusIcon status={singleExecution.status} />}
          >
            {optionText}
          </Option>
        );
      })}
    </StyledSelect>
  );
};

const StyledSelect = styled<SelectType>(Select)`
  margin-bottom: ${size.s};
`;
