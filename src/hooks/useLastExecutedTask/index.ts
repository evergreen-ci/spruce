import { useQuery } from "@apollo/client";
import { finishedTaskStatuses } from "constants/task";
import { useToastContext } from "context/toast";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { BASE_VERSION_AND_TASK, LAST_MAINLINE_COMMIT } from "gql/queries";
import { useParentTask } from "hooks/useParentTask";
import { string } from "utils";
import { getTaskFromMainlineCommitsQuery } from "utils/getTaskFromMainlineCommitsQuery";
import { isFinishedTaskStatus } from "utils/statuses";

const { applyStrictRegex } = string;

export const useLastExecutedTask = (taskId: string) => {
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
    tasks: [applyStrictRegex(displayName)],
    variants: [applyStrictRegex(buildVariant)],
  };

  const { task: parentTask } = useParentTask(taskId);

  const { data: lastExecutedTaskData, loading } = useQuery<
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
  const task = getTaskFromMainlineCommitsQuery(lastExecutedTaskData);

  return {
    task,
    loading,
  };
};
