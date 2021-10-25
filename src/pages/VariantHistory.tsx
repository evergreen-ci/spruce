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
  GetTaskNamesForBuildVariantQuery,
  GetTaskNamesForBuildVariantQueryVariables,
} from "gql/generated/types";
import {
  GET_MAINLINE_COMMITS_FOR_HISTORY,
  GET_TASK_NAMES_FOR_BUILD_VARIANT,
} from "gql/queries";
import { usePageTitle } from "hooks";
import { HistoryFilterOptions } from "types/history";
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
  const [nextPageOrderNumber, setNextPageOrderNumber] = useState(0);
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
  // We set the fetchPolicy to "cache-only" since this could be an expensive op and we want to avoid doing it twice
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

  const queryParamsToIgnore = new Set([HistoryFilterOptions.Task]);

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
              <TestSearch />
              <TaskSelector projectId={projectId} buildVariant={variantName} />
            </PageHeaderContent>
          </PageHeader>
          <BadgeWrapper>
            <FilterBadges queryParamsToIgnore={queryParamsToIgnore} />
          </BadgeWrapper>
          <ColumnPaginationButtons />
          <TableContainer>
            {taskNamesForBuildVariant && (
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
                    {VariantHistoryRow}
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
