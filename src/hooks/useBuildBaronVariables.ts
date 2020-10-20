import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { BuildBaronQuery, BuildBaronQueryVariables } from "gql/generated/types";
import { GET_BUILD_BARON } from "gql/queries";
import { TaskStatus } from "types/task";

interface Props {
  taskId: string;
  execution: number;
  taskStatus: string;
}

export const useBuildBaronVariables = ({
  taskId,
  execution,
  taskStatus,
}: Props) => {
  const [
    fetchBuildBaronData,
    {
      loading: buildBaronLoading,
      data: buildBaronData,
      error: buildBaronError,
    },
  ] = useLazyQuery<BuildBaronQuery, BuildBaronQueryVariables>(GET_BUILD_BARON);

  const failedTask =
    taskStatus === TaskStatus.Failed ||
    taskStatus === TaskStatus.TaskTimedOut ||
    taskStatus === TaskStatus.TestTimedOut;

  useEffect(() => {
    if (failedTask && execution !== undefined) {
      fetchBuildBaronData({ variables: { taskId, execution } });
    }
  }, [execution, taskId, failedTask, fetchBuildBaronData]);

  const buildBaron = buildBaronData?.buildBaron;
  const buildBaronConfigured = buildBaron?.buildBaronConfigured;

  // logic for displaying the build baron tab
  const buildBaronIsProductionReady = false;
  const showBuildBaronTab =
    failedTask &&
    execution !== undefined &&
    !buildBaronLoading &&
    buildBaronConfigured &&
    buildBaronIsProductionReady;

  return {
    showBuildBaronTab,
    buildBaronData,
    buildBaronError,
    buildBaronLoading,
  };
};
