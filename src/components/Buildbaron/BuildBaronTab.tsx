import React from "react";
import { useQuery } from "@apollo/client";
import BuildBaron from "components/Buildbaron/BuildBaron";
import { BuildBaronQuery, BuildBaronQueryVariables } from "gql/generated/types";
import { GET_BUILD_BARON } from "gql/queries";
import { usePrevious } from "hooks";

interface Props {
  taskId: string;
  execution: number;
  setShowbuildbarontab: React.Dispatch<React.SetStateAction<Boolean>>;
}

export const BuildBaronTab: React.FC<Props> = ({
  taskId,
  execution,
  setShowbuildbarontab,
}) => {
  const {
    data: buildBaronData,
    error: buildBaronError,
    loading: buildBaronLoading,
    refetch,
  } = useQuery<BuildBaronQuery, BuildBaronQueryVariables>(GET_BUILD_BARON, {
    variables: { taskId, execution },
  });
  const prevExecution = usePrevious(execution);
  if (execution !== prevExecution) {
    refetch();
  }
  console.log("in build baron");

  const buildBaron = buildBaronData?.buildBaron;
  const buildBaronConfigured = buildBaron?.buildBaronConfigured;
  console.log(buildBaron);

  // logic for displaying the build baron tab
  const buildBaronIsProductionReady = true;
  const showTab =
    !buildBaronLoading && buildBaronConfigured && buildBaronIsProductionReady;

  setShowbuildbarontab(showTab);

  if (showTab) {
    return (
      <BuildBaron
        data={buildBaronData}
        error={buildBaronError}
        taskId={taskId}
      />
    );
  }
  return null;
};
