import { useQuery } from "@apollo/client";
import { useToastContext } from "context/toast";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { BASE_VERSION_AND_TASK, LAST_MAINLINE_COMMIT } from "gql/queries";
import { useLastPassingTask } from "hooks/useLastPassingTask";
import { useParentTask } from "hooks/useParentTask";
import { TaskStatus } from "types/task";
import { string } from "utils";
import { getTaskFromMainlineCommitsQuery } from "utils/getTaskFromMainlineCommitsQuery";
import { isFailedTaskStatus } from "utils/statuses";

export const useBreakingTask = (taskId: string) => {
  const dispatchToast = useToastContext();

  const { data: taskData } = useQuery<
    BaseVersionAndTaskQuery,
    BaseVersionAndTaskQueryVariables
  >(BASE_VERSION_AND_TASK, {
    variables: { taskId },
  });

  const { buildVariant, displayName, projectIdentifier, status } =
    taskData?.task ?? {};

  const bvOptionsBase = {
    tasks: [string.applyStrictRegex(displayName)],
    variants: [string.applyStrictRegex(buildVariant)],
  };

  const { task: parentTask } = useParentTask(taskId);

  const { task: lastPassingTask } = useLastPassingTask(taskId);
  const passingOrderNumber = lastPassingTask?.order;

  // The breaking commit is the first failing commit after the last passing commit.
  // The skip order number should be the last passing commit's order number + 1.
  // We use + 2 because internally the query does a less than comparison.
  // https://github.com/evergreen-ci/evergreen/blob/f6751ac3194452d457c0a6fe1a9f9b30dd674c60/model/version.go#L518
  const { data: breakingTaskData, loading } = useQuery<
    LastMainlineCommitQuery,
    LastMainlineCommitQueryVariables
  >(LAST_MAINLINE_COMMIT, {
    skip: !parentTask || !lastPassingTask || !isFailedTaskStatus(status),
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
  const task = getTaskFromMainlineCommitsQuery(breakingTaskData);

  return {
    task,
    loading,
  };
};
