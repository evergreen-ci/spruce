import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Cookies from "js-cookie";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { FilterBadges } from "components/FilterBadges";
import { ProjectSelect } from "components/projectSelect";
import { PageWrapper } from "components/styles";
import { ALL_VALUE } from "components/TreeSelect";
import { TupleSelect } from "components/TupleSelect";
import { CURRENT_PROJECT } from "constants/cookies";
import { pollInterval } from "constants/index";
import { getCommitsRoute } from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  GetSpruceConfigQuery,
  GetSpruceConfigQueryVariables,
  MainlineCommitsQuery,
  MainlineCommitsQueryVariables,
} from "gql/generated/types";
import { GET_MAINLINE_COMMITS, GET_SPRUCE_CONFIG } from "gql/queries";
import { usePageTitle, usePolling } from "hooks";
import { ProjectFilterOptions, MainlineCommitQueryParams } from "types/commits";
import { array, queryString } from "utils";
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

export const Commits = () => {
  const dispatchToast = useToastContext();
  const { replace } = useHistory();
  const { search } = useLocation();
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const parsed = parseQueryString(search);

  // get query params from url
  const { id: projectId } = useParams<{ id: string }>();
  usePageTitle(`Project Health | ${projectId}`);
  const recentlySelectedProject = Cookies.get(CURRENT_PROJECT);
  // Push default project to URL if there isn't a project in
  // the URL already and an mci-project-cookie does not exist.
  useQuery<GetSpruceConfigQuery, GetSpruceConfigQueryVariables>(
    GET_SPRUCE_CONFIG,
    {
      skip: !!projectId || !!recentlySelectedProject,
      onCompleted({ spruceConfig }) {
        replace(getCommitsRoute(spruceConfig?.ui.defaultProject));
      },
    }
  );
  useEffect(() => {
    if (!projectId && recentlySelectedProject) {
      replace(getCommitsRoute(recentlySelectedProject));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

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

  const onSubmitTupleSelect = ({ category }: { category: string }) => {
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
            onRemove={() => {
              sendEvent({ name: "Remove badge" });
            }}
            onClearAll={() => {
              sendEvent({ name: "Clear all badges" });
            }}
            queryParamsToDisplay={queryParamsToDisplay}
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
  padding: ${size.s} 0;
  margin-bottom: ${size.m};
`;

const tupleSelectOptions = [
  {
    value: ProjectFilterOptions.BuildVariant,
    displayName: "Build Variant",
    placeHolderText: "Search Build Variant names",
  },
  {
    value: ProjectFilterOptions.Task,
    displayName: "Task",
    placeHolderText: "Search Task names",
  },
];

const ElementWrapper = styled.div`
  ${({ width }: { width: string }) => `width: ${width}%;`}
`;
