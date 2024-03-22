import { useQuery } from "@apollo/client";
import { useToastContext } from "context/toast";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { BASE_VERSION_AND_TASK, LAST_MAINLINE_COMMIT } from "gql/queries";
import { useParentTask } from "hooks/useParentTask";
import { TaskStatus } from "types/task";
import { string } from "utils";
import { getTaskFromMainlineCommitsQuery } from "utils/getTaskFromMainlineCommitsQuery";

export const useLastPassingTask = (taskId: string) => {
  const dispatchToast = useToastContext();

  const { data: taskData } = useQuery<
    BaseVersionAndTaskQuery,
    BaseVersionAndTaskQueryVariables
  >(BASE_VERSION_AND_TASK, {
    variables: { taskId },
  });

  const { buildVariant, displayName, projectIdentifier, versionMetadata } =
    taskData?.task ?? {};
  const { order: skipOrderNumber } = versionMetadata?.baseVersion ?? {};

  const bvOptionsBase = {
    tasks: [string.applyStrictRegex(displayName)],
    variants: [string.applyStrictRegex(buildVariant)],
  };

  const { task: parentTask } = useParentTask(taskId);

  const { data: lastPassingTaskData, loading } = useQuery<
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
  const task = getTaskFromMainlineCommitsQuery(lastPassingTaskData);

  return {
    task,
    loading,
  };
};
