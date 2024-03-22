import { useQuery } from "@apollo/client";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { BASE_VERSION_AND_TASK, LAST_MAINLINE_COMMIT } from "gql/queries";
import { string } from "utils";
import { getTaskFromMainlineCommitsQuery } from "utils/getTaskFromMainlineCommitsQuery";

export const useParentTask = (taskId: string) => {
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
    versionMetadata,
  } = taskData?.task ?? {};
  const { order: skipOrderNumber } = versionMetadata?.baseVersion ?? {};

  const bvOptionsBase = {
    tasks: [string.applyStrictRegex(displayName)],
    variants: [string.applyStrictRegex(buildVariant)],
  };

  const { data: parentTaskData, loading } = useQuery<
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
  const task = getTaskFromMainlineCommitsQuery(parentTaskData);

  return {
    task: task ?? baseTask,
    loading,
  };
};
