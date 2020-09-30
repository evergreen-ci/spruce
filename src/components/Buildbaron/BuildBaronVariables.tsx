import React, { useEffect } from "react";
import { ApolloError, useQuery } from "@apollo/client";
import { BuildBaronQuery, BuildBaronQueryVariables } from "gql/generated/types";
import { GET_BUILD_BARON } from "gql/queries";

interface Props {
  taskId: string;
  execution: number;
  setShowbuildbarontab: React.Dispatch<React.SetStateAction<Boolean>>;
  setbuildBaronData: React.Dispatch<React.SetStateAction<BuildBaronQuery>>;
  setbuildBaronError: React.Dispatch<React.SetStateAction<ApolloError>>;
}

export const BuildBaronVariables: React.FC<Props> = ({
  taskId,
  execution,
  setShowbuildbarontab,
  setbuildBaronData,
  setbuildBaronError,
}) => {
  const {
    data: buildBaronData,
    error: buildBaronError,
    loading: buildBaronLoading,
    refetch,
  } = useQuery<BuildBaronQuery, BuildBaronQueryVariables>(GET_BUILD_BARON, {
    variables: { taskId, execution },
  });

  useEffect(() => {
    refetch();
  }, [execution, refetch]);

  const buildBaron = buildBaronData?.buildBaron;
  const buildBaronConfigured = buildBaron?.buildBaronConfigured;

  // logic for displaying the build baron tab
  const buildBaronIsProductionReady = true;
  const showTab =
    !buildBaronLoading && buildBaronConfigured && buildBaronIsProductionReady;

  setShowbuildbarontab(showTab);
  setbuildBaronData(buildBaronData);
  setbuildBaronError(buildBaronError);

  return null;
};
