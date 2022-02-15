import { useState, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Option, Select } from "@leafygreen-ui/select";
import Tooltip from "@leafygreen-ui/tooltip";
import { Link } from "react-router-dom";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { getTaskRoute } from "constants/routes";
import { finishedTaskStatuses } from "constants/task";
import { size } from "constants/tokens";
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
import { TaskStatus, CommitTask } from "types/task";
import { errorReporting, statuses, string } from "utils";

const { isFinishedTaskStatus } = statuses;
const { applyStrictRegex } = string;
const { reportError } = errorReporting;

enum CommitType {
  Base = "base",
  LastPassing = "lastPassing",
  LastExecuted = "lastExecuted",
}
interface PreviousCommitsProps {
  taskId: string;
}
export const PreviousCommits: React.FC<PreviousCommitsProps> = ({ taskId }) => {
  const [selectState, setSelectState] = useState<CommitType>(CommitType.Base);
  const [parentTask, setParentTask] = useState<CommitTask>(null);
  const [lastPassingTask, setLastPassingTask] = useState<CommitTask>(null);
  const [lastExecutedTask, setLastExecutedTask] = useState<CommitTask>(null);

  const { data: taskData } = useQuery<
    GetBaseVersionAndTaskQuery,
    GetBaseVersionAndTaskQueryVariables
  >(GET_BASE_VERSION_AND_TASK, {
    variables: { taskId },
  });

  const [fetchParentTask] = useLazyQuery<
    GetLastMainlineCommitQuery,
    GetLastMainlineCommitQueryVariables
  >(GET_LAST_MAINLINE_COMMIT, {
    onCompleted: (data) => {
      const task = getTaskFromMainlineCommitsQuery(data);
      if (task) setParentTask(task);
    },
  });

  const [fetchLastPassing] = useLazyQuery<
    GetLastMainlineCommitQuery,
    GetLastMainlineCommitQueryVariables
  >(GET_LAST_MAINLINE_COMMIT, {
    onCompleted: (data) => {
      const task = getTaskFromMainlineCommitsQuery(data);
      if (task) setLastPassingTask(task);
    },
  });

  const [fetchLastExecuted] = useLazyQuery<
    GetLastMainlineCommitQuery,
    GetLastMainlineCommitQueryVariables
  >(GET_LAST_MAINLINE_COMMIT, {
    onCompleted: (data) => {
      const task = getTaskFromMainlineCommitsQuery(data);
      if (task) setLastExecutedTask(task);
    },
  });

  const { baseTask, versionMetadata, buildVariant, displayName } =
    taskData?.task ?? {};
  const { projectIdentifier, order } = versionMetadata?.baseVersion ?? {};
  const skipOrderNumber = versionMetadata?.isPatch ? order + 1 : order;
  const bvOptionsBase = {
    tasks: [applyStrictRegex(displayName)],
    variants: [applyStrictRegex(buildVariant)],
  };

  // Hook to determine the parent task. If mainline commit, use fetchParentTask function to get task from
  // previous mainline commit. Otherwise, just extract the base task from the task data.
  useEffect(() => {
    if (versionMetadata) {
      if (!versionMetadata.isPatch) {
        fetchParentTask({
          variables: {
            projectIdentifier,
            skipOrderNumber,
            buildVariantOptions: {
              ...bvOptionsBase,
            },
          },
        });
      } else {
        setParentTask(baseTask);
      }
    }
  }, [versionMetadata]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hook to find last passing & last executed tasks. This is a separate hook because the queries should only
  // run if the user selects these options. Additionally, these queries can only be run after the parentTask
  // is known.
  useEffect(() => {
    if (parentTask) {
      if (selectState === CommitType.LastPassing) {
        if (parentTask.status !== TaskStatus.Succeeded) {
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
      }

      if (selectState === CommitType.LastExecuted) {
        if (!isFinishedTaskStatus(parentTask.status)) {
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
    }
  }, [parentTask, selectState]); // eslint-disable-line react-hooks/exhaustive-deps

  // The default link should be undefined so that the GO button is disabled if links do not exist.
  let link: string;
  if (parentTask) {
    switch (selectState) {
      case CommitType.Base:
        link = getTaskRoute(parentTask.id);
        break;
      // If a base task succeeded, the last passing commit is the parent task.
      case CommitType.LastPassing:
        link = getTaskRoute(lastPassingTask?.id || parentTask.id);
        break;
      // If a base task exists and has finished, the last executed commit is the parent task.
      case CommitType.LastExecuted:
        link = getTaskRoute(lastExecutedTask?.id || parentTask.id);
        break;
      default:
    }
  }

  const lastPassingTaskDoesNotExist =
    !parentTask ||
    (selectState === CommitType.LastPassing &&
      !lastPassingTask &&
      parentTask.status !== TaskStatus.Succeeded);

  const lastExecutedTaskDoesNotExist =
    !parentTask ||
    (selectState === CommitType.LastExecuted &&
      !lastExecutedTask &&
      !isFinishedTaskStatus(parentTask.status));

  const disableButton =
    !link || lastPassingTaskDoesNotExist || lastExecutedTaskDoesNotExist;

  return versionMetadata?.isPatch !== undefined ? (
    <PreviousCommitsWrapper>
      <StyledSelect
        size="small"
        data-cy="previous-commits"
        label="Previous commits for this task"
        allowDeselect={false}
        onChange={(v: CommitType) => setSelectState(v)}
        value={selectState}
        disabled={!versionMetadata?.baseVersion}
      >
        <Option value={CommitType.Base}>
          Go to {versionMetadata?.isPatch ? "base commit" : "parent commit"}
        </Option>
        <Option value={CommitType.LastPassing}>
          Go to last passing version
        </Option>
        <Option value={CommitType.LastExecuted}>
          Go to last executed version
        </Option>
      </StyledSelect>

      <ConditionalWrapper
        condition={disableButton}
        wrapper={(children) => (
          <Tooltip
            align="top"
            justify="middle"
            triggerEvent="hover"
            trigger={children}
            darkMode
          >
            There is no version that satisfies this criteria.
          </Tooltip>
        )}
      >
        {/* This div is necessary, or else the tooltip will not show. */}
        <div>
          <Button
            as={Link}
            to={link || "/"}
            disabled={disableButton}
            size="small"
          >
            Go
          </Button>
        </div>
      </ConditionalWrapper>
    </PreviousCommitsWrapper>
  ) : null;
};

// The return value from GetLastMainlineCommitQuery has a lot of nested fields that may or may
// not exist. The logic to extract the task from it is written in this function.
const getTaskFromMainlineCommitsQuery = (
  data: GetLastMainlineCommitQuery
): CommitTask => {
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
  return buildVariants[0]?.tasks[0];
};

const PreviousCommitsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

// @ts-expect-error
const StyledSelect = styled(Select)`
  width: 220px;
  margin-right: ${size.xs};

  position: relative;
  bottom: 20px; // to offset the label
`;
