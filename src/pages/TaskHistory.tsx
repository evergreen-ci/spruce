import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { useLocation, useParams } from "react-router-dom";
import { FilterBadges } from "components/FilterBadges";
import HistoryTable, {
  context,
  ColumnPaginationButtons,
} from "components/HistoryTable";
import { HistoryTableTestSearch } from "components/HistoryTable/HistoryTableTestSearch/HistoryTableTestSearch";
import { PageWrapper } from "components/styles";
import {
  MainlineCommitsForHistoryQuery,
  MainlineCommitsForHistoryQueryVariables,
  GetBuildVariantsForTaskNameQuery,
  GetBuildVariantsForTaskNameQueryVariables,
} from "gql/generated/types";
import {
  GET_MAINLINE_COMMITS_FOR_HISTORY,
  GET_BUILD_VARIANTS_FOR_TASK_NAME,
} from "gql/queries";
import { usePageTitle } from "hooks";
import { TestStatus } from "types/history";
import { array, string } from "utils";
import { parseQueryString } from "utils/queryString";
import { BuildVariantSelector } from "./taskHistory/BuildVariantSelector";
import ColumnHeaders from "./taskHistory/ColumnHeaders";
import TaskHistoryRow from "./taskHistory/TaskHistoryRow";

const { applyStrictRegex } = string;
const { toArray } = array;
const { HistoryTableProvider, useHistoryTable } = context;

const TaskHistoryContents = () => {
  const { projectId, taskName } = useParams<{
    projectId: string;
    taskName: string;
  }>();

  usePageTitle(`Task History | ${projectId} | ${taskName}`);
  const [nextPageOrderNumber, setNextPageOrderNumber] = useState(0);
  const variables = {
    mainlineCommitsOptions: {
      projectID: projectId,
      limit: 20,
      skipOrderNumber: nextPageOrderNumber,
    },
    buildVariantOptions: {
      tasks: [applyStrictRegex(taskName)],
    },
  };

  const { data } = useQuery<
    MainlineCommitsForHistoryQuery,
    MainlineCommitsForHistoryQueryVariables
  >(GET_MAINLINE_COMMITS_FOR_HISTORY, {
    variables,
  });

  // Fetch the column headers from the same query used on the dropdown.
  const { data: columnData, loading } = useQuery<
    GetBuildVariantsForTaskNameQuery,
    GetBuildVariantsForTaskNameQueryVariables
  >(GET_BUILD_VARIANTS_FOR_TASK_NAME, {
    variables: {
      projectId,
      taskName,
    },
  });

  const { setHistoryTableFilters } = useHistoryTable();

  const { buildVariantsForTaskName } = columnData || {};
  const { mainlineCommits } = data || {};
  const { search } = useLocation();
  const queryParams = useMemo(() => parseQueryString(search), [search]);

  const selectedBuildVariants = toArray(queryParams.buildVariants);
  useEffect(() => {
    const failingTests = toArray(queryParams[TestStatus.Failed]);
    const passingTests = toArray(queryParams[TestStatus.Passed]);

    const failingTestFilters = failingTests.map((test) => ({
      testName: test,
      testStatus: TestStatus.Failed,
    }));
    const passingTestFilters = passingTests.map((test) => ({
      testName: test,
      testStatus: TestStatus.Passed,
    }));
    setHistoryTableFilters([...failingTestFilters, ...passingTestFilters]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);
  const queryParamsToDisplay = new Set([
    TestStatus.Failed,
    TestStatus.Passed,
    TestStatus.All,
  ]);

  const selectedColumns = selectedBuildVariants?.length
    ? buildVariantsForTaskName?.filter((bv) =>
        selectedBuildVariants.includes(bv.buildVariant)
      )
    : buildVariantsForTaskName;
  return (
    <PageWrapper>
      <CenterPage>
        <PageHeader>
          <H2>Task Name: {taskName}</H2>
          <PageHeaderContent>
            <HistoryTableTestSearch />
            <BuildVariantSelector projectId={projectId} taskName={taskName} />
          </PageHeaderContent>
        </PageHeader>
        <PaginationFilterWrapper>
          <BadgeWrapper>
            <FilterBadges queryParamsToDisplay={queryParamsToDisplay} />
          </BadgeWrapper>
          <ColumnPaginationButtons />
        </PaginationFilterWrapper>
        <div>
          <ColumnHeaders loading={loading} columns={selectedColumns} />
          <TableWrapper>
            <HistoryTable
              recentlyFetchedCommits={mainlineCommits}
              loadMoreItems={() => {
                if (mainlineCommits) {
                  setNextPageOrderNumber(mainlineCommits.nextPageOrderNumber);
                }
              }}
            >
              {TaskHistoryRow}
            </HistoryTable>
          </TableWrapper>
        </div>
      </CenterPage>
    </PageWrapper>
  );
};

export const TaskHistory = () => (
  <HistoryTableProvider>
    <TaskHistoryContents />
  </HistoryTableProvider>
);
const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 16px;
`;

const PageHeaderContent = styled.div`
  display: flex;
  align-items: flex-end;
  padding-top: 28px;
`;

const PaginationFilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
`;

const BadgeWrapper = styled.div`
  padding-bottom: 16px;
`;

const TableWrapper = styled.div`
  height: 80vh;
`;

const CenterPage = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
