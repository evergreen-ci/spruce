import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useLocation, useParams } from "react-router-dom";
import { useUserPatchesAnalytics } from "analytics";
import {
  PatchesPage,
  getPatchesInputFromURLSearch,
} from "components/PatchesPage";
import { pollInterval } from "constants/index";
import { useToastContext } from "context/toast";
import {
  UserPatchesQuery,
  UserPatchesQueryVariables,
} from "gql/generated/types";
import { GET_USER_PATCHES } from "gql/queries";
import {
  usePolling,
  useGetUserPatchesPageTitleAndLink,
  useUpdateURLQueryParams,
} from "hooks";
import { PatchPageQueryParams } from "types/patch";
import { queryString } from "utils";

const { parseQueryString } = queryString;

export const UserPatches = () => {
  const dispatchToast = useToastContext();
  const { id: userId } = useParams<{ id: string }>();
  const { search } = useLocation();
  const analyticsObject = useUserPatchesAnalytics();
  const updateQueryParams = useUpdateURLQueryParams();
  const parsed = parseQueryString(search);
  const isCommitQueueCheckboxChecked =
    parsed[PatchPageQueryParams.CommitQueue] === "true";

  const patchesInput = getPatchesInputFromURLSearch(search);

  useEffect(() => {
    if (parsed[PatchPageQueryParams.CommitQueue] === undefined) {
      updateQueryParams({
        [PatchPageQueryParams.CommitQueue]: `${true}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed]);

  const { data, startPolling, stopPolling, loading } = useQuery<
    UserPatchesQuery,
    UserPatchesQueryVariables
  >(GET_USER_PATCHES, {
    variables: {
      userId,
      patchesInput: {
        ...patchesInput,
        includeCommitQueue: isCommitQueueCheckboxChecked,
      },
    },
    pollInterval,
    onError: (err) => {
      dispatchToast.error(`Error while fetching user patches: ${err.message}`);
    },
  });
  usePolling(startPolling, stopPolling);
  const { title: pageTitle } = useGetUserPatchesPageTitleAndLink(userId);
  return (
    <PatchesPage
      analyticsObject={analyticsObject}
      pageTitle={pageTitle}
      loading={loading}
      pageType="user"
      patches={data?.user.patches}
    />
  );
};
