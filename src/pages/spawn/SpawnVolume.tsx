import React from "react";
import { useQuery } from "@apollo/client";
import { MyVolumesQuery, MyHostsQueryVariables } from "gql/generated/types";
import { GET_MY_VOLUMES } from "gql/queries";

export const SpawnVolume = () => {
  const { data: volumesData, loading: volumesLoading } = useQuery<
    MyVolumesQuery,
    MyHostsQueryVariables
  >(GET_MY_VOLUMES);

  return <div>spawn Volume page</div>;
};
