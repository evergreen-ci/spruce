import { useQuery } from "@apollo/client";
import {
  GetBuildBaronConfiguredQuery,
  GetBuildBaronConfiguredQueryVariables,
} from "gql/generated/types";
import { GET_BUILD_BARON_CONFIGURED } from "gql/queries";
import { statuses } from "utils";

const { isFailedTaskStatus } = statuses;
interface UseBuildBaronVariablesType {
  task: {
    id: string;
    execution: number;
    status: string;
  };
  hasAnnotation: boolean;
  canModifyAnnotation: boolean;
}
const useBuildBaronVariables = ({
  task,
  hasAnnotation,
  canModifyAnnotation,
}: UseBuildBaronVariablesType) => {
  const isFailedTask = isFailedTaskStatus(task.status);
  const { data: buildBaronData } = useQuery<
    GetBuildBaronConfiguredQuery,
    GetBuildBaronConfiguredQueryVariables
  >(GET_BUILD_BARON_CONFIGURED, {
    variables: {
      taskId: task.id,
      execution: task.execution,
    },
    skip: !isFailedTask && (!hasAnnotation || !canModifyAnnotation),
  });

  const buildBaronConfigured =
    buildBaronData?.buildBaron?.buildBaronConfigured || false;

  const showBuildBaron =
    isFailedTask &&
    (buildBaronConfigured || hasAnnotation || canModifyAnnotation);

  return {
    showBuildBaron,
  };
};

export default useBuildBaronVariables;
