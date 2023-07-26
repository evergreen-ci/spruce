import { useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import { useLocation, useParams } from "react-router-dom";
import { useUserPatchesAnalytics } from "analytics";
import { PatchesPage, usePatchesInputFromSearch } from "components/PatchesPage";
import { INCLUDE_COMMIT_QUEUE_USER_PATCHES } from "constants/cookies";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { useToastContext } from "context/toast";
import {
  UserPatchesQuery,
  UserPatchesQueryVariables,
} from "gql/generated/types";
import { GET_USER_PATCHES } from "gql/queries";
import { usePolling, useGetUserPatchesPageTitleAndLink } from "hooks";
import { useQueryParam } from "hooks/useQueryParam";
import { PatchPageQueryParams } from "types/patch";

export const UserPatches = () => {
  const dispatchToast = useToastContext();
  const { id: userId } = useParams<{ id: string }>();
  const { search } = useLocation();
  const analyticsObject = useUserPatchesAnalytics();

  const [isCommitQueueCheckboxChecked] = useQueryParam(
    PatchPageQueryParams.CommitQueue,
    Cookies.get(INCLUDE_COMMIT_QUEUE_USER_PATCHES) === "true"
  );

  const patchesInput = usePatchesInputFromSearch(search);

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    UserPatchesQuery,
    UserPatchesQueryVariables
  >(GET_USER_PATCHES, {
    fetchPolicy: "cache-and-network",
    onError: (err) => {
      dispatchToast.error(`Error while fetching user patches: ${err.message}`);
    },
    pollInterval: DEFAULT_POLL_INTERVAL,
    variables: {
      patchesInput: {
        ...patchesInput,
        includeCommitQueue: isCommitQueueCheckboxChecked,
      },
      userId,
    },
  });
  usePolling({ refetch, startPolling, stopPolling });
  const { title: pageTitle } = useGetUserPatchesPageTitleAndLink(userId) || {};

  return (
    <PatchesPage
      analyticsObject={analyticsObject}
      pageTitle={pageTitle}
      loading={loading && !data?.user.patches}
      pageType="user"
      patches={data?.user.patches}
    />
  );
};
