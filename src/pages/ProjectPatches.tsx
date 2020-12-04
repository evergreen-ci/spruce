import React from "react";
import { useQuery } from "@apollo/client";
import { useLocation, useParams } from "react-router-dom";
import {
  PatchesList,
  getPatchesInputFromURLSearch,
} from "components/PatchesPage";
import { pollInterval } from "constants/index";
import {
  ProjectPatchesQuery,
  ProjectPatchesQueryVariables,
} from "gql/generated/types";
import { GET_PROJECT_PATCHES } from "gql/queries";
import { useNetworkStatus } from "hooks";

export const ProjectPatches = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { search } = useLocation();
  const patchesInput = getPatchesInputFromURLSearch(search);
  const { data, startPolling, stopPolling, error } = useQuery<
    ProjectPatchesQuery,
    ProjectPatchesQueryVariables
  >(GET_PROJECT_PATCHES, {
    variables: { projectId, patchesInput },
    pollInterval,
    fetchPolicy: "cache-and-network",
  });
  useNetworkStatus(startPolling, stopPolling);

  return (
    <PatchesList
      pageTitle={`${data?.project.id} Patches`}
      error={error}
      patches={data?.project.patches}
    />
  );
};
