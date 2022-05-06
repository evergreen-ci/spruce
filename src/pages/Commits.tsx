import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Cookies from "js-cookie";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import FilterBadges, {
  useFilterBadgeQueryParams,
} from "components/FilterBadges";
import { ProjectSelect } from "components/projectSelect";
import { PageWrapper } from "components/styles";
import { ALL_VALUE } from "components/TreeSelect";
import TupleSelect from "components/TupleSelect";
import WelcomeModal from "components/WelcomeModal";
import { CURRENT_PROJECT } from "constants/cookies";
import { pollInterval } from "constants/index";
import { getCommitsRoute } from "constants/routes";
import { size } from "constants/tokens";
import { newMainlineCommitsUser } from "constants/welcomeModalProps";
import { useToastContext } from "context/toast";
import {
  GetSpruceConfigQuery,
  GetSpruceConfigQueryVariables,
  MainlineCommitsQuery,
  MainlineCommitsQueryVariables,
} from "gql/generated/types";
import { GET_MAINLINE_COMMITS, GET_SPRUCE_CONFIG } from "gql/queries";
import {
  usePageTitle,
  usePolling,
  useUpsertQueryParams,
  useUserSettings,
} from "hooks";
import { ProjectFilterOptions, MainlineCommitQueryParams } from "types/commits";
import { array, queryString, validators } from "utils";
import { CommitsWrapper } from "./commits/CommitsWrapper";
import CommitTypeSelect from "./commits/commitTypeSelect";
import { PaginationButtons } from "./commits/PaginationButtons";
import { StatusSelect } from "./commits/StatusSelect";
import {
  getMainlineCommitsQueryVariables,
  getFilterStatus,
} from "./commits/utils";

const { toArray } = array;
const { parseQueryString, getString } = queryString;
const { validateRegexp } = validators;

export const Commits = () => {
  const dispatchToast = useToastContext();
  const { replace } = useHistory();
  const { search } = useLocation();
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const { userSettings } = useUserSettings();
  const { useSpruceOptions } = userSettings ?? {};
  const { hasUsedMainlineCommitsBefore } = useSpruceOptions ?? {};

  const parsed = parseQueryString(search);

  // get query params from url
  const { id: projectId } = useParams<{ id: string }>();
  usePageTitle(`Project Health | ${projectId}`);
  const recentlySelectedProject = Cookies.get(CURRENT_PROJECT);
  // Push default project to URL if there isn't a project in
  // the URL already and an mci-project-cookie does not exist.
  const { data: spruceData } = useQuery<
    GetSpruceConfigQuery,
    GetSpruceConfigQueryVariables
  >(GET_SPRUCE_CONFIG, {
    skip: !!projectId || !!recentlySelectedProject,
  });
  useEffect(() => {
    if (!projectId) {
      if (recentlySelectedProject) {
        replace(getCommitsRoute(recentlySelectedProject));
      } else if (spruceData) {
        replace(getCommitsRoute(spruceData?.spruceConfig.ui.defaultProject));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, spruceData]);

  const statusFilters = toArray(parsed[ProjectFilterOptions.Status]);
  const variantFilters = toArray(parsed[ProjectFilterOptions.BuildVariant]);
  const taskFilters = toArray(parsed[ProjectFilterOptions.Task]);
  const requesterFilters = toArray(
    parsed[MainlineCommitQueryParams.Requester]
  ).filter((r) => r !== ALL_VALUE);
  const skipOrderNumberParam = getString(
    parsed[MainlineCommitQueryParams.SkipOrderNumber]
  );
  const skipOrderNumber = parseInt(skipOrderNumberParam, 10) || undefined;
  const filterState = {
    statuses: statusFilters,
    variants: variantFilters,
    tasks: taskFilters,
    requesters: requesterFilters,
  };
  const variables = getMainlineCommitsQueryVariables({
    mainlineCommitOptions: {
      projectID: projectId,
      skipOrderNumber,
      limit: 5,
    },
    filterState,
  });

  const { hasTasks, hasFilters } = getFilterStatus(filterState);

  const { data, loading, error, startPolling, stopPolling } = useQuery<
    MainlineCommitsQuery,
    MainlineCommitsQueryVariables
  >(GET_MAINLINE_COMMITS, {
    skip: !projectId,
    variables,
    pollInterval,
    onError: (e) =>
      dispatchToast.error(`There was an error loading the page: ${e.message}`),
  });
  usePolling(startPolling, stopPolling);

  const { mainlineCommits } = data || {};
  const { versions, nextPageOrderNumber, prevPageOrderNumber } =
    mainlineCommits || {};

  const queryParamsToDisplay = new Set([
    ProjectFilterOptions.BuildVariant,
    ProjectFilterOptions.Task,
  ]);

  const { badges, handleOnRemove, handleClearAll } = useFilterBadgeQueryParams(
    queryParamsToDisplay
  );
  const onSubmit = useUpsertQueryParams();

  const onSubmitTupleSelect = ({ category, value }) => {
    onSubmit({ category, value });
    switch (category) {
      case ProjectFilterOptions.BuildVariant:
        sendEvent({ name: "Filter by build variant" });
        break;
      case ProjectFilterOptions.Task:
        sendEvent({ name: "Filter by task" });
        break;
      default:
    }
  };

  return (
    <PageWrapper>
      <PageContainer>
        <HeaderWrapper>
          <ElementWrapper width="35">
            <TupleSelect
              options={tupleSelectOptions}
              onSubmit={onSubmitTupleSelect}
              validator={validateRegexp}
              validatorErrorMessage="Invalid Regular Expression"
            />
          </ElementWrapper>
          <ElementWrapper width="20">
            <StatusSelect />
          </ElementWrapper>
          <ElementWrapper width="20">
            <CommitTypeSelect />
          </ElementWrapper>
          <ElementWrapper width="25">
            <ProjectSelect
              selectedProjectIdentifier={projectId}
              getRoute={getCommitsRoute}
              onSubmit={() => {
                sendEvent({
                  name: "Select project",
                });
              }}
            />
          </ElementWrapper>
        </HeaderWrapper>
        <BadgeWrapper>
          <FilterBadges
            onRemove={(b) => {
              sendEvent({ name: "Remove badge" });
              handleOnRemove(b);
            }}
            onClearAll={() => {
              sendEvent({ name: "Clear all badges" });
              handleClearAll();
            }}
            badges={badges}
          />
        </BadgeWrapper>
        <PaginationWrapper>
          <PaginationButtons
            prevPageOrderNumber={prevPageOrderNumber}
            nextPageOrderNumber={nextPageOrderNumber}
          />
        </PaginationWrapper>
        <CommitsWrapper
          versions={versions}
          error={error}
          isLoading={loading || !projectId}
          hasTaskFilter={hasTasks}
          hasFilters={hasFilters}
        />
      </PageContainer>
      {!hasUsedMainlineCommitsBefore && (
        <WelcomeModal
          param="hasUsedMainlineCommitsBefore"
          carouselCards={newMainlineCommitsUser}
        />
      )}
    </PageWrapper>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  > div:not(:last-of-type) {
    margin-right: ${size.s};
  }
`;
const BadgeWrapper = styled.div`
  margin: ${size.s} 0;
`;
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: ${size.xs};
`;

const tupleSelectOptions = [
  {
    value: ProjectFilterOptions.BuildVariant,
    displayName: "Build Variant",
    placeHolderText: "Search build variant regex",
  },
  {
    value: ProjectFilterOptions.Task,
    displayName: "Task",
    placeHolderText: "Search task regex",
  },
];

const ElementWrapper = styled.div`
  ${({ width }: { width: string }) => `width: ${width}%;`}
`;
