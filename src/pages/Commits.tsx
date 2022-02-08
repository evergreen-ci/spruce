import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Cookies from "js-cookie";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { FilterBadges } from "components/FilterBadges";
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
import { usePageTitle, useNetworkStatus, useUpdateURLQueryParams } from "hooks";
import {
  ChartToggleQueryParams,
  ChartTypes,
  ProjectFilterOptions,
  MainlineCommitQueryParams,
} from "types/commits";
import { TaskStatus } from "types/task";
import { array, queryString } from "utils";
import { CommitsWrapper } from "./commits/CommitsWrapper";
import CommitTypeSelect from "./commits/commitTypeSelect";
import { PaginationButtons } from "./commits/PaginationButtons";
import { ProjectSelect } from "./commits/projectSelect";
import { StatusSelect } from "./commits/StatusSelect";

const { toArray } = array;
const { parseQueryString, getString } = queryString;
const DEFAULT_CHART_TYPE = ChartTypes.Absolute;
const FAILED_STATUSES = [
  TaskStatus.Failed,
  TaskStatus.TaskTimedOut,
  TaskStatus.TestTimedOut,
  TaskStatus.KnownIssue,
  TaskStatus.Aborted,
];

export const Commits = () => {
  const dispatchToast = useToastContext();
  const { replace } = useHistory();
  const { search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const parsed = parseQueryString(search);
  const currentChartType =
    (getString(parsed[ChartToggleQueryParams.chartType]) as ChartTypes) ||
    DEFAULT_CHART_TYPE;

  const onChangeChartType = (chartType: ChartTypes): void => {
    updateQueryParams({
      [ChartToggleQueryParams.chartType]: chartType,
    });
  };

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

  const filterStatuses = toArray(parsed[ProjectFilterOptions.Status]);
  const filterVariants = toArray(parsed[ProjectFilterOptions.BuildVariant]);
  const filterTasks = toArray(parsed[ProjectFilterOptions.Task]);
  const filterRequesters = toArray(
    parsed[MainlineCommitQueryParams.Requester]
  ).filter((r) => r !== ALL_VALUE);
  const skipOrderNumberParam = getString(
    parsed[MainlineCommitQueryParams.SkipOrderNumber]
  );
  const skipOrderNumber = parseInt(skipOrderNumberParam, 10) || undefined;

  const hasTaskFilter = filterTasks.length > 0;

  const buildVariantOptionsForTask = {
    statuses: filterStatuses,
    variants: filterVariants,
    tasks: filterTasks,
  };

  const hasFilters =
    filterStatuses.length > 0 || filterVariants.length > 0 || hasTaskFilter;

  const mainlineCommitsOptions = {
    projectID: projectId,
    limit: 5,
    skipOrderNumber,
    shouldCollapse: hasFilters,
    requesters: filterRequesters,
  };

  const buildVariantOptions = {
    statuses: hasFilters ? filterStatuses : FAILED_STATUSES,
    variants: filterVariants,
    tasks: filterTasks,
  };

  const { data, loading, error, startPolling, stopPolling } = useQuery<
    MainlineCommitsQuery,
    MainlineCommitsQueryVariables
  >(GET_MAINLINE_COMMITS, {
    skip: !projectId,
    variables: {
      mainlineCommitsOptions,
      buildVariantOptionsForTask,
      buildVariantOptions,
    },
    pollInterval,
    onError: (e) =>
      dispatchToast.error(`There was an error loading the page: ${e.message}`),
  });
  useNetworkStatus(startPolling, stopPolling);

  const { mainlineCommits } = data || {};
  const { versions, nextPageOrderNumber, prevPageOrderNumber } =
    mainlineCommits || {};

  const queryParamsToDisplay = new Set([
    ProjectFilterOptions.BuildVariant,
    ProjectFilterOptions.Task,
  ]);

  return (
    <PageWrapper>
      <PageContainer>
        <HeaderWrapper>
          <ElementWrapper width="35">
            <TupleSelect options={tupleSelectOptions} />
          </ElementWrapper>
          <ElementWrapper width="20">
            <StatusSelect />
          </ElementWrapper>
          <ElementWrapper width="20">
            <CommitTypeSelect />
          </ElementWrapper>
          <ElementWrapper width="25">
            <ProjectSelect selectedProjectIdentifier={projectId} />
          </ElementWrapper>
        </HeaderWrapper>
        <BadgeWrapper>
          <FilterBadges queryParamsToDisplay={queryParamsToDisplay} />
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
          chartType={currentChartType}
          hasTaskFilter={hasTaskFilter}
          hasFilters={hasFilters}
          onChangeChartType={onChangeChartType}
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
