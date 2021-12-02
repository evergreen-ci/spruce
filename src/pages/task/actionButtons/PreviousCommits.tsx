import { useState, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Option, Select } from "@leafygreen-ui/select";
import { Link } from "react-router-dom";
import { getTaskRoute } from "constants/routes";
import {
  GetBaseVersionAndTaskQuery,
  GetBaseVersionAndTaskQueryVariables,
  GetLastMainlineCommitQuery,
  GetLastMainlineCommitQueryVariables,
} from "gql/generated/types";
import {
  GET_BASE_VERSION_AND_TASK,
  GET_LAST_MAINLINE_COMMIT,
} from "gql/queries";
import { TaskStatus } from "types/task";
import { errorReporting } from "utils";
import { applyStrictRegex } from "utils/string";

const { reportError } = errorReporting;
type commitType = "base" | "lastPassing" | "lastExecuted";
interface Props {
  taskId: string;
}
export const PreviousCommits: React.FC<Props> = ({ taskId }) => {
  const [selectState, setSelectState] = useState<commitType>("base");
  const { data: taskData } = useQuery<
    GetBaseVersionAndTaskQuery,
    GetBaseVersionAndTaskQueryVariables
  >(GET_BASE_VERSION_AND_TASK, {
    variables: { taskId },
  });
  const [
    fetchLastPassing,
    { data: lastPassingData, called: lastPassingCalled },
  ] = useLazyQuery<
    GetLastMainlineCommitQuery,
    GetLastMainlineCommitQueryVariables
  >(GET_LAST_MAINLINE_COMMIT);

  const [
    fetchLastExecuted,
    { data: lastExecutedData, called: lastExecutedCalled },
  ] = useLazyQuery<
    GetLastMainlineCommitQuery,
    GetLastMainlineCommitQueryVariables
  >(GET_LAST_MAINLINE_COMMIT);

  const { baseTask, versionMetadata, buildVariant, displayName } =
    taskData?.task ?? {};
  const { id: baseTaskId, status: baseTaskStatus } = baseTask ?? {};
  const { projectIdentifier, order } = versionMetadata?.baseVersion ?? {};
  // Increment order by 1 to consider the base commit in the query.
  const skipOrderNumber = order + 1;
  useEffect(() => {
    const bvOptionsBase = {
      tasks: [applyStrictRegex(displayName)],
      variants: [applyStrictRegex(buildVariant)],
    };
    if (
      selectState === "lastPassing" &&
      !lastPassingCalled &&
      baseTaskStatus !== TaskStatus.Succeeded
    ) {
      fetchLastPassing({
        variables: {
          projectIdentifier,
          skipOrderNumber,
          buildVariantOptions: {
            ...bvOptionsBase,
            statuses: [TaskStatus.Succeeded],
          },
        },
      });
    }
    if (selectState === "lastExecuted" && !baseTaskId && !lastExecutedCalled) {
      fetchLastExecuted({
        variables: {
          projectIdentifier,
          skipOrderNumber,
          buildVariantOptions: bvOptionsBase,
        },
      });
    }
  }, [
    baseTaskId,
    baseTaskStatus,
    buildVariant,
    displayName,
    fetchLastExecuted,
    fetchLastPassing,
    lastExecutedCalled,
    lastPassingCalled,
    projectIdentifier,
    selectState,
    skipOrderNumber,
  ]);

  const lastPassingTaskId = getTaskIdFromMainlineCommitsQuery(lastPassingData);
  const lastExecutedTaskId = getTaskIdFromMainlineCommitsQuery(
    lastExecutedData
  );
  let link = "";
  switch (selectState) {
    case "base":
      // The task may not exist on the base version if it was generated.
      link = baseTaskId ? getTaskRoute(baseTaskId) : "";
      break;
    case "lastPassing":
      // If a base task succeeded, the last passing commit is the base task.
      if (baseTaskStatus === TaskStatus.Succeeded) {
        link = getTaskRoute(baseTaskId);
      } else if (lastPassingTaskId) {
        link = getTaskRoute(lastPassingTaskId);
      } else {
        link = "";
      }
      break;
    case "lastExecuted":
      // If a base task exists, the last executed commit is the base task.
      if (baseTaskId) {
        link = getTaskRoute(baseTaskId);
      } else if (lastExecutedTaskId) {
        link = getTaskRoute(lastExecutedTaskId);
      } else {
        link = "";
      }
      break;
    default:
  }

  return (
    <Container>
      <StyledSelect
        size="small"
        label="Previous commits for this task"
        onChange={(v) => setSelectState(v as commitType)}
        data-cy="previous-commits"
        allowDeselect={false}
        value={selectState}
        disabled={!versionMetadata?.baseVersion}
      >
        <Option value="base" key="base">
          Go to base commit
        </Option>
        <Option value="lastPassing" key="lastPassing">
          Go to last passing version
        </Option>
        <Option value="lastExecuted" key="lastExecuted">
          Go to last executed version
        </Option>
      </StyledSelect>
      <Button as={Link} to={link} disabled={!link} size="small">
        Go
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

// @ts-expect-error
const StyledSelect = styled(Select)`
  margin-right: 8px;
  margin-top: -20px;
`;

const getTaskIdFromMainlineCommitsQuery = (
  data: GetLastMainlineCommitQuery
) => {
  const buildVariants =
    data?.mainlineCommits.versions.find(({ version }) => version)?.version
      .buildVariants ?? [];
  if (buildVariants.length > 1) {
    reportError(
      "Multiple build variants matched previous commit search."
    ).warning();
  }
  if (buildVariants[0]?.tasks.length > 1) {
    reportError("Multiple tasks matched previous commit search.").warning();
  }
  return buildVariants[0]?.tasks[0]?.id;
};
