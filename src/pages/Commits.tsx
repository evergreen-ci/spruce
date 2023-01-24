import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Cookies from "js-cookie";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import FilterBadges, {
  useFilterBadgeQueryParams,
} from "components/FilterBadges";
import { ProjectSelect } from "components/ProjectSelect";
import { PageWrapper } from "components/styles";
import { ALL_VALUE } from "components/TreeSelect";
import WelcomeModal from "components/WelcomeModal";
import { CURRENT_PROJECT } from "constants/cookies";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
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
import TupleSelectWithRegexConditional from "./commits/TupleSelectWithRegexConditional";
import {
  getMainlineCommitsQueryVariables,
  getFilterStatus,
} from "./commits/utils";
import { WaterfallMenu } from "./commits/WaterfallMenu";

const { toArray } = array;
const { parseQueryString, getString } = queryString;
const { validateRegexp } = validators;

export const Commits = () => {
  const dispatchToast = useToastContext();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const { userSettings } = useUserSettings();
  const { useSpruceOptions } = userSettings ?? {};
  const { hasUsedMainlineCommitsBefore = true } = useSpruceOptions ?? {};

  const parsed = parseQueryString(search);
  const { projectIdentifier } = useParams<{
    projectIdentifier: string;
  }>();

  usePageTitle(`Project Health | ${projectIdentifier}`);
  const recentlySelectedProject = Cookies.get(CURRENT_PROJECT);
  // Push default project to URL if there isn't a project in
  // the URL already and an mci-project-cookie does not exist.
  const { data: spruceData } = useQuery<
    GetSpruceConfigQuery,
    GetSpruceConfigQueryVariables
  >(GET_SPRUCE_CONFIG, {
    skip: !!projectIdentifier || !!recentlySelectedProject,
  });

  useEffect(() => {
    if (!projectIdentifier) {
      if (recentlySelectedProject) {
        navigate(getCommitsRoute(recentlySelectedProject), { replace: true });
      } else if (spruceData) {
        navigate(getCommitsRoute(spruceData?.spruceConfig.ui.defaultProject), {
          replace: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectIdentifier, spruceData]);

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
      projectID: projectIdentifier,
      skipOrderNumber,
      limit: 5,
    },
    filterState,
  });

  const { hasTasks, hasFilters } = getFilterStatus(filterState);

  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery<
    MainlineCommitsQuery,
    MainlineCommitsQueryVariables
  >(GET_MAINLINE_COMMITS, {
    skip: !projectIdentifier,
    variables,
    pollInterval: DEFAULT_POLL_INTERVAL,
    onError: (e) =>
      dispatchToast.error(`There was an error loading the page: ${e.message}`),
  });
  usePolling({ startPolling, stopPolling, refetch });

  const { mainlineCommits } = data || {};
  const { versions, nextPageOrderNumber, prevPageOrderNumber } =
    mainlineCommits || {};

  const queryParamsToDisplay = new Set([
    ProjectFilterOptions.BuildVariant,
    ProjectFilterOptions.Task,
  ]);

  const { badges, handleOnRemove, handleClearAll } =
    useFilterBadgeQueryParams(queryParamsToDisplay);
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
            <TupleSelectWithRegexConditional
              options={tupleSelectOptions}
              onSubmit={onSubmitTupleSelect}
              validator={validateRegexp}
              validatorErrorMessage="Invalid Regular Expression"
              label="Add New Filter"
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
              selectedProjectIdentifier={projectIdentifier}
              getRoute={getCommitsRoute}
              onSubmit={() => {
                sendEvent({
                  name: "Select project",
                });
              }}
            />
          </ElementWrapper>
          <WaterfallMenu />
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
          isLoading={loading || !projectIdentifier}
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
  align-items: flex-end;
  gap: ${size.s};
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
    placeHolderText: "Search build variants",
  },
  {
    value: ProjectFilterOptions.Task,
    displayName: "Task",
    placeHolderText: "Search task names",
  },
];

const ElementWrapper = styled.div`
  ${({ width }: { width: string }) => `width: ${width}%;`}
`;
