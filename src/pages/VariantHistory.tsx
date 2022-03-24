import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
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
import {
  MainlineCommitsForHistoryQuery,
  MainlineCommitsForHistoryQueryVariables,
} from "gql/generated/types";
import { GET_MAINLINE_COMMITS_FOR_HISTORY } from "gql/queries";
import { usePageTitle } from "hooks";
import { string } from "utils";
import {
  ColumnHeaders,
  TaskSelector,
  VariantHistoryRow,
} from "./variantHistory/index";

const { HistoryTableProvider } = context;
const { useTestFilters } = hooks;
const { applyStrictRegex } = string;

export const VariantHistoryContents: React.FC = () => {
  const { projectId, variantName } = useParams<{
    projectId: string;
    variantName: string;
  }>();

  usePageTitle(`Variant History | ${projectId} | ${variantName}`);
  const [nextPageOrderNumber, setNextPageOrderNumber] = useState(null);

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

  const { mainlineCommits } = data || {};

  useTestFilters();
  // const selectedColumns = useColumns(taskNamesForBuildVariant, (c) => c);

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
          <ColumnHeaders projectId={projectId} variantName={variantName} />
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
