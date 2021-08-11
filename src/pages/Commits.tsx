import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useParams, useLocation } from "react-router-dom";
import { FilterBadges } from "components/FilterBadges";
import { PageWrapper } from "components/styles";
import { TupleSelect } from "components/TupleSelect";
import { pollInterval } from "constants/index";
import { useToastContext } from "context/toast";
import {
  MainlineCommitsQuery,
  MainlineCommitsQueryVariables,
} from "gql/generated/types";
import { GET_MAINLINE_COMMITS } from "gql/queries";
import { usePageTitle, useNetworkStatus } from "hooks";
import { PageDoesNotExist } from "pages/404";
import { CommitsWrapper } from "pages/commits/CommitsWrapper";
import {
  ChartToggleQueryParams,
  ChartTypes,
  ProjectFilterOptions,
} from "types/commits";
import { TaskStatus } from "types/task";
import { queryString } from "utils";
import { ProjectSelect } from "./commits/projectSelect";
import { StatusSelect } from "./commits/StatusSelect";

const { getArray } = queryString;
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
  const { search } = useLocation();
  const [currentChartType, setCurrentChartType] = useState<ChartTypes>(
    DEFAULT_CHART_TYPE
  );

  // get query params from url
  const { projectId } = useParams<{ projectId: string }>();
  const parsed = queryString.parseQueryString(search);
  const chartTypeParam = (parsed[ChartToggleQueryParams.chartType] || "")
    .toString()
    .toLowerCase();
  const filterStatuses = getArray(parsed[ProjectFilterOptions.Status] || []);
  const filterVariants = getArray(
    parsed[ProjectFilterOptions.BuildVariant] || []
  );
  const filterTasks = getArray(parsed[ProjectFilterOptions.Task] || []);

  // set current chart type based on query param
  useEffect(() => {
    if (
      chartTypeParam === ChartTypes.Absolute ||
      chartTypeParam === ChartTypes.Percentage
    ) {
      setCurrentChartType(chartTypeParam);
    } else {
      setCurrentChartType(DEFAULT_CHART_TYPE);
    }
  }, [chartTypeParam, setCurrentChartType]);

  // query mainlineCommits data
  const mainlineCommitsOptions = { projectID: projectId, limit: 5 };
  const buildVariantOptionsForTask = {
    statuses: filterStatuses,
    variants: filterVariants,
    tasks: filterTasks,
  };
  const defaultFilterByFailed = !(
    filterStatuses.length ||
    filterVariants.length ||
    filterTasks.length
  );
  const buildVariantOptions = {
    statuses: defaultFilterByFailed ? FAILED_STATUSES : filterStatuses,
    variants: filterVariants,
    tasks: filterTasks,
  };
  const { data, loading, error, startPolling, stopPolling } = useQuery<
    MainlineCommitsQuery,
    MainlineCommitsQueryVariables
  >(GET_MAINLINE_COMMITS, {
    variables: {
      mainlineCommitsOptions,
      buildVariantOptionsForTask,
      buildVariantOptions,
    },
    pollInterval,
    onError: (e) =>
      dispatchToast.error(`There was an error loading the page: ${e.message}`),
  });
  usePageTitle(`Project Health | ${projectId}`);
  useNetworkStatus(startPolling, stopPolling);
  const { mainlineCommits } = data || {};
  const { versions } = mainlineCommits || {};
  if (error) {
    return <PageDoesNotExist />;
  }

  return (
    <PageWrapper>
      <HeaderWrapper>
        <TupleSelectWrapper>
          <TupleSelect options={tupleSelectOptions} />
        </TupleSelectWrapper>
        <StatusSelectWrapper>
          <StatusSelect />
        </StatusSelectWrapper>
        <ProjectSelectWrapper>
          <ProjectSelect selectedProject={projectId} />
        </ProjectSelectWrapper>
      </HeaderWrapper>
      <BadgeWrapper>
        <FilterBadges />
      </BadgeWrapper>
      <CommitsWrapper
        versions={versions}
        error={error}
        isLoading={loading}
        chartType={currentChartType}
      />
    </PageWrapper>
  );
};

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  > div:not(:last-of-type) {
    margin-right: 16px;
  }
`;

const BadgeWrapper = styled.div`
  padding-top: 32px;
  padding-bottom: 32px;
  height: 32px;
`;
const TupleSelectWrapper = styled.div`
  width: 40%;
`;
const StatusSelectWrapper = styled.div`
  width: 30%;

  .cy-treeselect-bar {
    height: 32px;
    padding-bottom: 0;
    padding-top: 0;

    > div,
    > span {
      line-height: 30px;
    }
  }
`;
const ProjectSelectWrapper = styled.div`
  width: 30%;
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
