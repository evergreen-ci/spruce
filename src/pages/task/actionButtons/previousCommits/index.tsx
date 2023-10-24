import { useMemo, useReducer, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { Option, Select } from "@leafygreen-ui/select";
import Tooltip from "@leafygreen-ui/tooltip";
import { Link, useParams } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { LoadingButton } from "components/Buttons";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { finishedTaskStatuses } from "constants/task";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { BASE_VERSION_AND_TASK, LAST_MAINLINE_COMMIT } from "gql/queries";
import { useLGButtonRouterLink } from "hooks/useLGButtonRouterLink";
import { TaskStatus } from "types/task";
import { statuses, string } from "utils";
import { reportError } from "utils/errorReporting";
import { getLinks, initialState, reducer } from "./reducer";
import { CommitTask, CommitType } from "./types";

const { applyStrictRegex } = string;
const { isFinishedTaskStatus } = statuses;

interface PreviousCommitsProps {
  taskId: string;
}
export const PreviousCommits: React.FC<PreviousCommitsProps> = ({ taskId }) => {
  const { sendEvent } = useTaskAnalytics();
  const [
    {
      disableButton,
      hasFetchedLastExecuted,
      hasFetchedLastPassing,
      link,
      selectState,
      shouldFetchLastExecuted,
      shouldFetchLastPassing,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const dispatchToast = useToastContext();

  const { data: taskData } = useQuery<
    BaseVersionAndTaskQuery,
    BaseVersionAndTaskQueryVariables
  >(BASE_VERSION_AND_TASK, {
    variables: { taskId },
  });

  const { baseTask, buildVariant, displayName, versionMetadata } =
    taskData?.task ?? {};
  const { order: skipOrderNumber, projectIdentifier } =
    versionMetadata?.baseVersion ?? {};
  const bvOptionsBase = {
    tasks: [applyStrictRegex(displayName)],
    variants: [applyStrictRegex(buildVariant)],
  };

  // We don't error for this query because it is the default query that is run when the page loads.
  // If it errors it probably means there is no base version, which is fine.
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
        `Could not fetch last task execution: '${err.message}'`
      );
    },
  });
  const lastExecutedTask =
    getTaskFromMainlineCommitsQuery(lastExecutedTaskData);

  const linkObject = useMemo(
    () =>
      getLinks({
        parentTask,
        lastPassingTask,
        lastExecutedTask,
      }),
    [parentTask, lastPassingTask, lastExecutedTask]
  );

  return (
    <Menu
      trigger={
        <Button size={Size.Small} disabled={!parentTask}>
          Previous commits
        </Button>
      }
    >
      <MenuItem as={Link} to={linkObject[CommitType.Base].link}>
        {versionMetadata?.isPatch ? "Base" : "Previous"} commit
      </MenuItem>
      <MenuItem as={Link} to={linkObject[CommitType.LastPassing].link}>
        Last passing version
      </MenuItem>
      <MenuItem
        as={Link}
        to={linkObject[CommitType.LastExecuted].link}
        disabled={
          linkObject[CommitType.LastExecuted].disabled || executedLoading
        }
      >
        Last executed version
      </MenuItem>
    </Menu>
  );
};

// The return value from GetLastMainlineCommitQuery has a lot of nested fields that may or may
// not exist. The logic to extract the task from it is written in this function.
const getTaskFromMainlineCommitsQuery = (
  data: LastMainlineCommitQuery
): CommitTask => {
  const buildVariants =
    data?.mainlineCommits.versions.find(({ version }) => version)?.version
      .buildVariants ?? [];
  if (buildVariants.length > 1) {
    reportError(
      new Error("Multiple build variants matched previous commit search.")
    ).warning();
  }
  if (buildVariants[0]?.tasks.length > 1) {
    reportError(
      new Error("Multiple tasks matched previous commit search.")
    ).warning();
  }
  return buildVariants[0]?.tasks[0];
};
