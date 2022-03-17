import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { useLocation, useParams } from "react-router-dom";
import { FilterBadges } from "components/FilterBadges";
import HistoryTable, {
  context,
  ColumnPaginationButtons,
  HistoryTableTestSearch,
  hooks,
  constants,
} from "components/HistoryTable";
import { PageWrapper } from "components/styles";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
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
import { HistoryQueryParams } from "types/history";
import { queryString, string, errorReporting } from "utils";

import {
  ColumnHeaders,
  TaskSelector,
  VariantHistoryRow,
} from "./variantHistory/index";

const { reportError } = errorReporting;
const { HistoryTableProvider } = context;
const { useTestFilters, useColumns } = hooks;
const { parseQueryString, getString } = queryString;
const { applyStrictRegex } = string;

export const VariantHistoryContents: React.FC = () => {
  const { projectId, variantName } = useParams<{
    projectId: string;
    variantName: string;
  }>();
  const { search } = useLocation();
  const queryParams = useMemo(() => parseQueryString(search), [search]);
  const skipOrderNumberParam = getString(
    queryParams[HistoryQueryParams.SkipOrderNumber]
  );
  const skipOrderNumber = parseInt(skipOrderNumberParam, 10) || undefined;

  const dispatchToast = useToastContext();
  usePageTitle(`Variant History | ${projectId} | ${variantName}`);
  const [nextPageOrderNumber, setNextPageOrderNumber] = useState(
    skipOrderNumber
  );

  const variables = {
    mainlineCommitsOptions: {
      projectID: projectId,
      limit: 5,
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
    onCompleted: ({ taskNamesForBuildVariant }) => {
      if (!taskNamesForBuildVariant) {
        reportError(
          new Error("No task names found for build variant")
        ).severe();
        dispatchToast.error(`No tasks found for buildVariant: ${variantName}}`);
      }
    },
  });

  const { taskNamesForBuildVariant } = columnData || {};
  const { mainlineCommits } = data || {};

  useTestFilters();
  const selectedColumns = useColumns(
    "tasks",
    taskNamesForBuildVariant,
    (c) => c
  );

  return (
    <PageWrapper>
      <CenterPage>
        <PageHeader>
          <H2>Build Variant: {variantName}</H2>
          <PageHeaderContent>
            <HistoryTableTestSearch />
            <TaskSelector projectId={projectId} buildVariant={variantName} />
          </PageHeaderContent>
        </PageHeader>
        <PaginationFilterWrapper>
          <BadgeWrapper>
            <FilterBadges
              queryParamsToDisplay={constants.queryParamsToDisplay}
            />
          </BadgeWrapper>
          <ColumnPaginationButtons />
        </PaginationFilterWrapper>
        <div>
          <ColumnHeaders
            projectId={projectId}
            loading={loading}
            columns={selectedColumns}
          />
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
        </div>
      </CenterPage>
    </PageWrapper>
  );
};

export const VariantHistory = () => (
  <HistoryTableProvider>
    <VariantHistoryContents />
  </HistoryTableProvider>
);
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
  padding-top: ${size.s};
`;

const BadgeWrapper = styled.div`
  padding-bottom: ${size.s};
`;

const TableWrapper = styled.div`
  height: 80vh;
`;

const CenterPage = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
