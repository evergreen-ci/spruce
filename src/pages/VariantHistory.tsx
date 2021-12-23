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
import { HistoryTableTestSearch } from "components/HistoryTable/HistoryTableTestSearch/HistoryTableTestSearch";
import { PageWrapper } from "components/styles";
import {
  MainlineCommitsForHistoryQuery,
  MainlineCommitsForHistoryQueryVariables,
  GetTaskNamesForBuildVariantQuery,
  GetTaskNamesForBuildVariantQueryVariables,
} from "gql/generated/types";
import {
  GET_MAINLINE_COMMITS_FOR_HISTORY,
  GET_TASK_NAMES_FOR_BUILD_VARIANT,
} from "gql/queries";
import { usePageTitle } from "hooks";
import { TestStatus } from "types/history";
import { queryString, string } from "utils";
import ColumnHeaders from "./variantHistory/ColumnHeaders";
import { TaskSelector } from "./variantHistory/TaskSelector";
import VariantHistoryRow from "./variantHistory/VariantHistoryRow";

const { HistoryTableProvider } = context;
const { parseQueryString } = queryString;
const { applyStrictRegex } = string;

export const VariantHistory = () => {
  const { projectId, variantName } = useParams<{
    projectId: string;
    variantName: string;
  }>();

  usePageTitle(`Variant History | ${projectId} | ${variantName}`);
  const [nextPageOrderNumber, setNextPageOrderNumber] = useState(null);
  const variables = {
    mainlineCommitsOptions: {
      projectID: projectId,
      limit: 20,
      skipOrderNumber: nextPageOrderNumber,
    },
    buildVariantOptions: {
      variants: [applyStrictRegex(variantName)],
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
    GetTaskNamesForBuildVariantQuery,
    GetTaskNamesForBuildVariantQueryVariables
  >(GET_TASK_NAMES_FOR_BUILD_VARIANT, {
    variables: {
      projectId,
      buildVariant: variantName,
    },
  });

  const { taskNamesForBuildVariant } = columnData || {};
  const { mainlineCommits } = data || {};
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  let selectedTaskNames = [];
  if (typeof queryParams.tasks === "string") {
    selectedTaskNames = [queryParams.tasks];
  } else {
    selectedTaskNames = queryParams.tasks;
  }

  const queryParamsToDisplay = new Set([
    TestStatus.Failed,
    TestStatus.Passed,
    TestStatus.All,
  ]);

  const selectedColumns = selectedTaskNames?.length
    ? taskNamesForBuildVariant?.filter((task) =>
        selectedTaskNames.includes(task)
      )
    : taskNamesForBuildVariant;
  return (
    <PageWrapper>
      <CenterPage>
        <HistoryTableProvider>
          <PageHeader>
            <H2>Build Variant: {variantName}</H2>
            <PageHeaderContent>
              <HistoryTableTestSearch />
              <TaskSelector projectId={projectId} buildVariant={variantName} />
            </PageHeaderContent>
          </PageHeader>
          <PaginationFilterWrapper>
            <BadgeWrapper>
              <FilterBadges queryParamsToDisplay={queryParamsToDisplay} />
            </BadgeWrapper>
            <ColumnPaginationButtons />
          </PaginationFilterWrapper>
          <TableContainer>
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
                {VariantHistoryRow}
              </HistoryTable>
            </TableWrapper>
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
const TableContainer = styled.div`
  padding-top: 60px;
`;

const CenterPage = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
