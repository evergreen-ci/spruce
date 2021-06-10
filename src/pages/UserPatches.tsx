import React from "react";
import { useQuery } from "@apollo/client";
import { useLocation, useParams } from "react-router-dom";
import { useUserPatchesAnalytics } from "analytics";
import {
  PatchesPage,
  getPatchesInputFromURLSearch,
} from "components/PatchesPage";
import { pollInterval } from "constants/index";
import {
  UserPatchesQuery,
  UserPatchesQueryVariables,
} from "gql/generated/types";
import { GET_USER_PATCHES } from "gql/queries";
import { useNetworkStatus, useGetUserPatchesPageTitleAndLink } from "hooks";

export const UserPatches = () => {
  const { id: userId } = useParams<{ id: string }>();
  const { search } = useLocation();
  const analyticsObject = useUserPatchesAnalytics();
  const patchesInput = getPatchesInputFromURLSearch(search);
  const { data, startPolling, stopPolling, error } = useQuery<
    UserPatchesQuery,
    UserPatchesQueryVariables
  >(GET_USER_PATCHES, {
    variables: { userId, patchesInput },
    pollInterval,
    fetchPolicy: "cache-and-network",
  });
  useNetworkStatus(startPolling, stopPolling);
  const { title: pageTitle } = useGetUserPatchesPageTitleAndLink(userId);
  return (
    <PatchesPage
      analyticsObject={analyticsObject}
      pageTitle={pageTitle}
      error={error}
      type="user"
      patches={data?.user.patches}
    />
  );
};
