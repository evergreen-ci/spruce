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
import { TaskStatus, finishedTaskStatuses } from "types/task";
import { errorReporting } from "utils";
import { isFinishedTaskStatus } from "utils/statuses";
import { applyStrictRegex } from "utils/string";

const { reportError } = errorReporting;
enum CommitType {
  Base = "base",
  LastPassing = "lastPassing",
  LastExecuted = "lastExecuted",
}
interface Props {
  taskId: string;
}

export const PreviousCommits: React.FC<Props> = ({ taskId }) => {
  const [selectState, setSelectState] = useState<CommitType>(CommitType.Base);
  const [parentTask, setParentTask] = useState(null);
  const { data: taskData } = useQuery<
    GetBaseVersionAndTaskQuery,
    GetBaseVersionAndTaskQueryVariables
  >(GET_BASE_VERSION_AND_TASK, {
    variables: { taskId },
  });

  const [fetchParentTask, { data: parentTaskData }] = useLazyQuery<
    GetLastMainlineCommitQuery,
    GetLastMainlineCommitQueryVariables
  >(GET_LAST_MAINLINE_COMMIT);

  useEffect(() => {
    const { version } = parentTaskData?.mainlineCommits?.versions[0] || {};
    if (version) {
      setParentTask(version.buildVariants[0].tasks[0]);
    }
  }, [parentTaskData]);

  const [fetchLastPassing, { data: lastPassingData }] = useLazyQuery<
    GetLastMainlineCommitQuery,
    GetLastMainlineCommitQueryVariables
  >(GET_LAST_MAINLINE_COMMIT);

  const [fetchLastExecuted, { data: lastExecutedData }] = useLazyQuery<
    GetLastMainlineCommitQuery,
    GetLastMainlineCommitQueryVariables
  >(GET_LAST_MAINLINE_COMMIT);

  const { baseTask, versionMetadata, buildVariant, displayName } =
    taskData?.task ?? {};

  const { id: parentTaskId, status: parentTaskStatus } = parentTask ?? {};
  const { projectIdentifier, order } = versionMetadata?.baseVersion ?? {};
  useEffect(() => {
    // If the current version is a mainline commit,
    // the parent task is of the previous mainline commit.
    // Otherwise, it is the base task.
    if (versionMetadata?.isPatch === false) {
      fetchParentTask({
        variables: {
          projectIdentifier,
          skipOrderNumber: order,
          buildVariantOptions: {
            tasks: [applyStrictRegex(displayName)],
            variants: [applyStrictRegex(buildVariant)],
          },
        },
      });
    } else if (versionMetadata?.isPatch === true) {
      setParentTask(baseTask);
    }
  }, [
    baseTask,
    buildVariant,
    displayName,
    fetchParentTask,
    order,
    projectIdentifier,
    versionMetadata?.isPatch,
  ]);
  const isParentTaskFinished = isFinishedTaskStatus(parentTaskStatus);
  useEffect(() => {
    if (versionMetadata?.isPatch !== undefined) {
      // The last passing & last executed version of a non-mainline commit patch may
      // include the base version of the patch.
      const skipOrderNumber = versionMetadata.isPatch ? order + 1 : order;
      const bvOptionsBase = {
        tasks: [applyStrictRegex(displayName)],
        variants: [applyStrictRegex(buildVariant)],
      };
      if (
        selectState === CommitType.LastPassing &&
        parentTaskStatus !== TaskStatus.Succeeded
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
      if (selectState === CommitType.LastExecuted && !isParentTaskFinished) {
        fetchLastExecuted({
          variables: {
            projectIdentifier,
            skipOrderNumber,
            buildVariantOptions: {
              ...bvOptionsBase,
              statuses: finishedTaskStatuses,
            },
          },
        });
      }
    }
  }, [
    parentTaskId,
    parentTaskStatus,
    buildVariant,
    displayName,
    fetchLastExecuted,
    fetchLastPassing,
    isParentTaskFinished,
    projectIdentifier,
    selectState,
    order,
    versionMetadata,
  ]);

  const lastPassingTaskId = getTaskIdFromMainlineCommitsQuery(lastPassingData);
  const lastExecutedTaskId = getTaskIdFromMainlineCommitsQuery(
    lastExecutedData
  );
  let link = "";
  switch (selectState) {
    case CommitType.Base:
      // The task may not exist on the base version base version is inactive or task is generated.
      link = parentTaskId ? getTaskRoute(parentTaskId) : "";
      break;
    case CommitType.LastPassing:
      // If a base task succeeded, the last passing commit is the base task.
      if (parentTaskStatus === TaskStatus.Succeeded) {
        link = getTaskRoute(parentTaskId);
      } else if (lastPassingTaskId) {
        link = getTaskRoute(lastPassingTaskId);
      } else {
        link = "";
      }
      break;
    case CommitType.LastExecuted:
      // If a base task exists and has finished, the last executed commit is the base task.
      if (isParentTaskFinished) {
        link = getTaskRoute(parentTaskId);
      } else if (lastExecutedTaskId) {
        link = getTaskRoute(lastExecutedTaskId);
      } else {
        link = "";
      }
      break;
    default:
  }
  return versionMetadata?.isPatch !== undefined ? (
    <Container>
      <StyledSelect
        size="small"
        label="Previous commits for this task"
        onChange={(v) => setSelectState(v as CommitType)}
        data-cy="previous-commits"
        allowDeselect={false}
        value={selectState}
        disabled={!versionMetadata?.baseVersion}
      >
        <Option value="base" key="base">
          Go to {versionMetadata?.isPatch ? "base commit" : "parent commit"}
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
  ) : null;
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
