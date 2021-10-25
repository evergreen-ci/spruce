import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { useLocation, useParams } from "react-router-dom";
import { FilterBadges } from "components/FilterBadges";
import HistoryTable, {
  context,
  ColumnPaginationButtons,
} from "components/HistoryTable";
import { TestSearch } from "components/HistoryTable/TestSearch/TestSearch";
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
import { HistoryFilterOptions } from "types/history";
import { parseQueryString } from "utils/queryString";
import { BuildVariantSelector } from "./taskHistory/BuildVariantSelector";
import ColumnHeaders from "./taskHistory/ColumnHeaders";
import TaskHistoryRow from "./taskHistory/TaskHistoryRow";

const { HistoryTableProvider } = context;

export const TaskHistory = () => {
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
      tasks: [taskName],
    },
  };

  const { data } = useQuery<
    MainlineCommitsForHistoryQuery,
    MainlineCommitsForHistoryQueryVariables
  >(GET_MAINLINE_COMMITS_FOR_HISTORY, {
    variables,
  });

  // Fetch the column headers from the same query used on the dropdown.
  // We set the fetchPolicy to "cache-only" since this could be an expensive op and we want to avoid doing it twice
  const { data: columnData, loading } = useQuery<
    GetBuildVariantsForTaskNameQuery,
    GetBuildVariantsForTaskNameQueryVariables
  >(GET_BUILD_VARIANTS_FOR_TASK_NAME, {
    variables: {
      projectId,
      taskName,
    },
    fetchPolicy: "cache-only",
  });

  const { buildVariantsForTaskName } = columnData || {};
  const { mainlineCommits } = data || {};
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  let selectedBuildVariants = [];
  if (typeof queryParams.buildVariants === "string") {
    selectedBuildVariants = [queryParams.buildVariants];
  } else {
    selectedBuildVariants = queryParams.buildVariants;
  }

  const queryParamsToIgnore = new Set([HistoryFilterOptions.BuildVariant]);

  const selectedColumns = selectedBuildVariants?.length
    ? buildVariantsForTaskName?.filter((bv) =>
        selectedBuildVariants.includes(bv.buildVariant)
      )
    : buildVariantsForTaskName;
  return (
    <PageWrapper>
      <CenterPage>
        <HistoryTableProvider>
          <PageHeader>
            <H2>Task Name: {taskName}</H2>
            <PageHeaderContent>
              <TestSearch />
              <BuildVariantSelector projectId={projectId} taskName={taskName} />
            </PageHeaderContent>
          </PageHeader>
          <BadgeWrapper>
            <FilterBadges queryParamsToIgnore={queryParamsToIgnore} />
          </BadgeWrapper>
          <ColumnPaginationButtons />
          <TableContainer>
            {buildVariantsForTaskName && (
              <>
                <ColumnHeaders loading={loading} columns={selectedColumns} />
                <TableWrapper>
                  <HistoryTable
                    recentlyFetchedCommits={mainlineCommits}
                    loadMoreItems={() => {
                      if (mainlineCommits) {
                        setNextPageOrderNumber(
                          mainlineCommits.nextPageOrderNumber
                        );
                      }
                    }}
                  >
                    {TaskHistoryRow}
                  </HistoryTable>
                </TableWrapper>
              </>
            )}
          </TableContainer>
        </HistoryTableProvider>
      </CenterPage>
    </PageWrapper>
  );
};

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PageHeaderContent = styled.div`
  display: flex;
  align-items: flex-end;
  padding-top: 28px;
`;

const BadgeWrapper = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
`;

const TableWrapper = styled.div`
  height: 80vh;
`;
const TableContainer = styled.div`
  padding-top: 60px;
`;

const CenterPage = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
