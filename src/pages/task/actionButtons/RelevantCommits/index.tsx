import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import Button, { Size } from "@leafygreen-ui/button";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import Tooltip from "@leafygreen-ui/tooltip";
import { Link } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import Icon from "components/Icon";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
} from "gql/generated/types";
import { BASE_VERSION_AND_TASK } from "gql/queries";
import { useBreakingTask } from "hooks/useBreakingTask";
import { useLastExecutedTask } from "hooks/useLastExecutedTask";
import { useLastPassingTask } from "hooks/useLastPassingTask";
import { useParentTask } from "hooks/useParentTask";
import { CommitType } from "./types";
import { getLinks } from "./utils";

interface RelevantCommitsProps {
  taskId: string;
}

export const RelevantCommits: React.FC<RelevantCommitsProps> = ({ taskId }) => {
  const { sendEvent } = useTaskAnalytics();

  const { data: taskData } = useQuery<
    BaseVersionAndTaskQuery,
    BaseVersionAndTaskQueryVariables
  >(BASE_VERSION_AND_TASK, {
    variables: { taskId },
  });

  const { baseTask, versionMetadata } = taskData?.task ?? {};

  const { loading: parentLoading, task: parentTask } = useParentTask(taskId);

  const { loading: passingLoading, task: lastPassingTask } =
    useLastPassingTask(taskId);

  const { loading: breakingLoading, task: breakingTask } =
    useBreakingTask(taskId);

  const { loading: executedLoading, task: lastExecutedTask } =
    useLastExecutedTask(taskId);

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
            name: "Submit Relevant Commit Selector",
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
            name: "Submit Relevant Commit Selector",
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
            name: "Submit Relevant Commit Selector",
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
            name: "Submit Relevant Commit Selector",
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
