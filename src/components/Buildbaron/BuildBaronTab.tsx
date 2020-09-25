import React from "react";
import { useQuery } from "@apollo/client";
import { Tab } from "@leafygreen-ui/tabs";
import BuildBaron from "components/Buildbaron/BuildBaron";
import { BuildBaronQuery, BuildBaronQueryVariables } from "gql/generated/types";
import { GET_BUILD_BARON } from "gql/queries";

interface Props {
  taskId: string;
  execution: number;
  setshowbuildbarontab: React.Dispatch<React.SetStateAction<Boolean>>;
}

export const BuildBaronTab: React.FC<Props> = ({
  taskId,
  execution,
  setshowbuildbarontab,
}) => {
  const {
    data: buildBaronData,
    error: buildBaronError,
    loading: buildBaronLoading,
  } = useQuery<BuildBaronQuery, BuildBaronQueryVariables>(GET_BUILD_BARON, {
    variables: { taskId, execution },
  });
  const buildBaron = buildBaronData?.buildBaron;
  const buildBaronConfigured = buildBaron?.buildBaronConfigured;

  // logic for displaying the build baron tab
  const buildBaronIsProductionReady = false;
  const showTab =
    !buildBaronLoading && buildBaronConfigured && buildBaronIsProductionReady;

  setshowbuildbarontab(showTab);

  if (showTab) {
    return (
      <Tab name="Build Baron" id="task-build-baron-tab">
        <BuildBaron
          data={buildBaronData}
          error={buildBaronError}
          taskId={taskId}
        />
      </Tab>
    );
  }
  return null;
};
