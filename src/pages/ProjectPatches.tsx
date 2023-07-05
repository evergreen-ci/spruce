import { useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import { useLocation, useParams } from "react-router-dom";
import { useProjectPatchesAnalytics } from "analytics/patches/useProjectPatchesAnalytics";
import { ProjectBanner } from "components/Banners";
import { PatchesPage, usePatchesInputFromSearch } from "components/PatchesPage";
import { ProjectSelect } from "components/ProjectSelect";
import { INCLUDE_COMMIT_QUEUE_PROJECT_PATCHES } from "constants/cookies";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { getProjectPatchesRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  ProjectPatchesQuery,
  ProjectPatchesQueryVariables,
} from "gql/generated/types";
import { GET_PROJECT_PATCHES } from "gql/queries";
import { usePolling } from "hooks";
import { useQueryParam } from "hooks/useQueryParam";
import { PatchPageQueryParams } from "types/patch";

export const ProjectPatches = () => {
  const dispatchToast = useToastContext();
  const analyticsObject = useProjectPatchesAnalytics();

  const { projectIdentifier } = useParams<{ projectIdentifier: string }>();
  const { search } = useLocation();
  const [isCommitQueueCheckboxChecked] = useQueryParam(
    PatchPageQueryParams.CommitQueue,
    Cookies.get(INCLUDE_COMMIT_QUEUE_PROJECT_PATCHES) === "true"
  );

  const patchesInput = usePatchesInputFromSearch(search);

  const { data, refetch, startPolling, stopPolling, loading } = useQuery<
    ProjectPatchesQuery,
    ProjectPatchesQueryVariables
  >(GET_PROJECT_PATCHES, {
    variables: {
      projectIdentifier,
      patchesInput: {
        ...patchesInput,
        onlyCommitQueue: isCommitQueueCheckboxChecked,
      },
    },
    pollInterval: DEFAULT_POLL_INTERVAL,
    onError: (err) => {
      dispatchToast.error(
        `Error while fetching project patches: ${err.message}`
      );
    },
  });
  usePolling({ startPolling, stopPolling, refetch });
  const { displayName, patches } = data?.project ?? {};
  return (
    <>
      <ProjectBanner projectIdentifier={projectIdentifier} />
      <PatchesPage
        analyticsObject={analyticsObject}
        loading={loading}
        pageTitle={`${displayName ?? ""} Patches`}
        pageType="project"
        filterComp={
          <ProjectSelect
            getRoute={getProjectPatchesRoute}
            selectedProjectIdentifier={projectIdentifier}
            showLabel={false}
            onSubmit={() => {
              analyticsObject.sendEvent({ name: "Change Project" });
            }}
          />
        }
        patches={patches}
      />
    </>
  );
};
