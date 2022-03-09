import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useLocation, useParams } from "react-router-dom";
import { useProjectPatchesAnalytics } from "analytics/patches/useProjectPatchesAnalytics";
import {
  PatchesPage,
  getPatchesInputFromURLSearch,
} from "components/PatchesPage";
import { pollInterval } from "constants/index";
import { useToastContext } from "context/toast";
import {
  ProjectPatchesQuery,
  ProjectPatchesQueryVariables,
} from "gql/generated/types";
import { GET_PROJECT_PATCHES } from "gql/queries";
import { usePollForQueries, useUpdateURLQueryParams } from "hooks";
import { PatchPageQueryParams } from "types/patch";
import { queryString } from "utils";

const { parseQueryString } = queryString;

export const ProjectPatches = () => {
  const dispatchToast = useToastContext();
  const { id: projectId } = useParams<{ id: string }>();
  const { search } = useLocation();
  const parsed = parseQueryString(search);
  const updateQueryParams = useUpdateURLQueryParams();

  const patchesInput = getPatchesInputFromURLSearch(search);
  const isCommitQueueCheckboxChecked =
    parsed[PatchPageQueryParams.CommitQueue] === "true";

  useEffect(() => {
    if (parsed[PatchPageQueryParams.CommitQueue] === undefined) {
      updateQueryParams({
        [PatchPageQueryParams.CommitQueue]: `${false}`,
      });
    }
  }, [parsed, updateQueryParams]);
  const analyticsObject = useProjectPatchesAnalytics();

  const { data, startPolling, stopPolling, loading } = useQuery<
    ProjectPatchesQuery,
    ProjectPatchesQueryVariables
  >(GET_PROJECT_PATCHES, {
    variables: {
      projectId,
      patchesInput: {
        ...patchesInput,
        onlyCommitQueue: isCommitQueueCheckboxChecked,
      },
    },
    pollInterval,
    onError: (err) => {
      dispatchToast.error(
        `Error while fetching project patches: ${err.message}`
      );
    },
  });
  usePollForQueries(startPolling, stopPolling);
  const { displayName, patches } = data?.project ?? {};
  return (
    <PatchesPage
      analyticsObject={analyticsObject}
      pageTitle={`${displayName ?? ""} Patches`}
      loading={loading}
      pageType="project"
      patches={patches}
    />
  );
};
