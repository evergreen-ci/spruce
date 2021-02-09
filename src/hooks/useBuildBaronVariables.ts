import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { BuildBaronQuery, BuildBaronQueryVariables } from "gql/generated/types";
import { GET_BUILD_BARON } from "gql/queries";
import { isFailedTaskStatus } from "utils";

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

  const isFailedTask = isFailedTaskStatus(taskStatus);

  useEffect(() => {
    if (isFailedTask && execution !== undefined) {
      fetchBuildBaronData({ variables: { taskId, execution } });
    }
  }, [execution, taskId, isFailedTask, fetchBuildBaronData]);

  const buildBaron = buildBaronData?.buildBaron;
  const buildBaronConfigured = buildBaron?.buildBaronConfigured;

  // logic for displaying the build baron tab
  const buildBaronIsProductionReady = true;
  const showBuildBaron =
    execution !== undefined &&
    !buildBaronLoading &&
    buildBaronConfigured &&
    buildBaronIsProductionReady;

  return {
    showBuildBaron,
    buildBaronData,
    buildBaronError,
    buildBaronLoading,
  };
};
