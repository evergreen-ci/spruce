import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import Button, { Size } from "@leafygreen-ui/button";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import Tooltip from "@leafygreen-ui/tooltip";
import { Link } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import Icon from "components/Icon";
import { finishedTaskStatuses } from "constants/task";
import { useToastContext } from "context/toast";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { BASE_VERSION_AND_TASK, LAST_MAINLINE_COMMIT } from "gql/queries";
import { TaskStatus } from "types/task";
import { statuses, string } from "utils";
import { CommitType } from "./types";
import { getLinks, getTaskFromMainlineCommitsQuery } from "./utils";

const { applyStrictRegex } = string;
const { isFinishedTaskStatus } = statuses;

interface RelevantCommitsProps {
  taskId: string;
}
export const RelevantCommits: React.FC<RelevantCommitsProps> = ({ taskId }) => {
  const { sendEvent } = useTaskAnalytics();
  const dispatchToast = useToastContext();

  const { data: taskData } = useQuery<
    BaseVersionAndTaskQuery,
    BaseVersionAndTaskQueryVariables
  >(BASE_VERSION_AND_TASK, {
    variables: { taskId },
  });

  const {
    baseTask,
    buildVariant,
    displayName,
    projectIdentifier,
    status,
    versionMetadata,
  } = taskData?.task ?? {};
  const { order: skipOrderNumber } = versionMetadata?.baseVersion ?? {};

  const bvOptionsBase = {
    tasks: [applyStrictRegex(displayName)],
    variants: [applyStrictRegex(buildVariant)],
  };

  const { data: parentTaskData, loading: parentLoading } = useQuery<
    LastMainlineCommitQuery,
    LastMainlineCommitQueryVariables
  >(LAST_MAINLINE_COMMIT, {
    skip: !versionMetadata || versionMetadata.isPatch,
    variables: {
      projectIdentifier,
      skipOrderNumber,
      buildVariantOptions: {
        ...bvOptionsBase,
      },
    },
  });
  const parentTask =
    getTaskFromMainlineCommitsQuery(parentTaskData) ?? baseTask;

  const { data: lastPassingTaskData, loading: passingLoading } = useQuery<
    LastMainlineCommitQuery,
    LastMainlineCommitQueryVariables
  >(LAST_MAINLINE_COMMIT, {
    skip: !parentTask || parentTask.status === TaskStatus.Succeeded,
    variables: {
      projectIdentifier,
      skipOrderNumber,
      buildVariantOptions: {
        ...bvOptionsBase,
        statuses: [TaskStatus.Succeeded],
      },
    },
    onError: (err) => {
      dispatchToast.error(`Last passing version unavailable: '${err.message}'`);
    },
  });
  const lastPassingTask = getTaskFromMainlineCommitsQuery(lastPassingTaskData);
  const passingOrderNumber = lastPassingTask?.order;

  // The breaking commit is the first failing commit after the last passing commit.
  // The skip order number should be the last passing commit's order number + 1.
  // We use + 2 because internally the query does a less than comparison.
  const { data: breakingTaskData, loading: breakingLoading } = useQuery<
    LastMainlineCommitQuery,
    LastMainlineCommitQueryVariables
  >(LAST_MAINLINE_COMMIT, {
    skip:
      !parentTask ||
      !lastPassingTask ||
      status === undefined ||
      status === TaskStatus.Succeeded,
    variables: {
      projectIdentifier,
      skipOrderNumber: passingOrderNumber + 2,
      buildVariantOptions: {
        ...bvOptionsBase,
        statuses: [TaskStatus.Failed],
      },
    },
    onError: (err) => {
      dispatchToast.error(`Breaking commit unavailable: '${err.message}'`);
    },
  });
  const breakingTask = getTaskFromMainlineCommitsQuery(breakingTaskData);

  const { data: lastExecutedTaskData, loading: executedLoading } = useQuery<
    LastMainlineCommitQuery,
    LastMainlineCommitQueryVariables
  >(LAST_MAINLINE_COMMIT, {
    skip: !parentTask || isFinishedTaskStatus(parentTask.status),
    variables: {
      projectIdentifier,
      skipOrderNumber,
      buildVariantOptions: {
        ...bvOptionsBase,
        statuses: finishedTaskStatuses,
      },
    },
    onError: (err) => {
      dispatchToast.error(
        `Could not fetch last task execution: '${err.message}'`,
      );
    },
  });
  const lastExecutedTask =
    getTaskFromMainlineCommitsQuery(lastExecutedTaskData);

  const linkObject = useMemo(
    () =>
      getLinks({
        parentTask,
        breakingTask,
        lastPassingTask,
        lastExecutedTask,
      }),
    [parentTask, breakingTask, lastPassingTask, lastExecutedTask],
  );

  const menuDisabled = !baseTask || !parentTask;

  return menuDisabled ? (
    <Tooltip
      justify="middle"
      trigger={
        <Button
          disabled
          rightGlyph={<Icon glyph="CaretDown" />}
          size={Size.Small}
        >
          Relevant commits
        </Button>
      }
    >
      No relevant versions available.
    </Tooltip>
  ) : (
    <Menu
      trigger={
        <Button rightGlyph={<Icon glyph="CaretDown" />} size={Size.Small}>
          Relevant commits
        </Button>
      }
    >
      <MenuItem
        as={Link}
        disabled={parentLoading}
        onClick={() =>
          sendEvent({
            name: "Submit Previous Commit Selector",
            type: CommitType.Base,
          })
        }
        to={linkObject[CommitType.Base]}
      >
        Go to {versionMetadata?.isPatch ? "base" : "previous"} commit
      </MenuItem>
      <MenuItem
        as={Link}
        disabled={breakingLoading || breakingTask === undefined}
        onClick={() =>
          sendEvent({
            name: "Submit Previous Commit Selector",
            type: CommitType.Breaking,
          })
        }
        to={linkObject[CommitType.Breaking]}
      >
        Go to breaking commit
      </MenuItem>
      <MenuItem
        as={Link}
        disabled={passingLoading}
        onClick={() =>
          sendEvent({
            name: "Submit Previous Commit Selector",
            type: CommitType.LastPassing,
          })
        }
        to={linkObject[CommitType.LastPassing]}
      >
        Go to last passing version
      </MenuItem>
      <MenuItem
        as={Link}
        disabled={executedLoading}
        onClick={() =>
          sendEvent({
            name: "Submit Previous Commit Selector",
            type: CommitType.LastExecuted,
          })
        }
        to={linkObject[CommitType.LastExecuted]}
      >
        Go to last executed version
      </MenuItem>
    </Menu>
  );
};
