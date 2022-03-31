import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { FilterBadges } from "components/FilterBadges";
import HistoryTable, {
  context,
  ColumnPaginationButtons,
  HistoryTableTestSearch,
  hooks,
  constants,
} from "components/HistoryTable";
import { HistoryTableTestSearchAnalytics } from "components/HistoryTable/HistoryTableTestSearch/HistoryTableTestSearch";
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
  BuildVariantSelector,
  ColumnHeaders,
  TaskHistoryRow,
} from "./taskHistory/index";

const { HistoryTableProvider } = context;
const { applyStrictRegex } = string;
const { useTestFilters } = hooks;

const TaskHistoryContents: React.FC = () => {
  const { sendEvent } = useProjectHealthAnalytics();
  const { projectId, taskName } = useParams<{
    projectId: string;
    taskName: string;
  }>();
  usePageTitle(`Task History | ${projectId} | ${taskName}`);
  const [nextPageOrderNumber, setNextPageOrderNumber] = useState(null);
  const variables = {
    mainlineCommitsOptions: {
      projectID: projectId,
      limit: 5,
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

  useTestFilters();
  const { mainlineCommits } = data || {};

  return (
    <PageWrapper>
      <CenterPage>
        <PageHeader>
          <H2>Task Name: {taskName}</H2>
          <PageHeaderContent>
            <HistoryTableTestSearch
              sendAnalytics={(v: HistoryTableTestSearchAnalytics) => {
                sendEvent({
                  name: "Submit task history failed test filter",
                  ...v,
                });
              }}
            />
            <BuildVariantSelector projectId={projectId} taskName={taskName} />
          </PageHeaderContent>
        </PageHeader>
        <PaginationFilterWrapper>
          <BadgeWrapper>
            <FilterBadges
              queryParamsToDisplay={constants.queryParamsToDisplay}
              onRemoveAnalytics={() => {
                sendEvent({ name: "Remove task history badge" });
              }}
              onClearAllAnalytics={() => {
                sendEvent({ name: "Clear all task history badges" });
              }}
            />
          </BadgeWrapper>
          <ColumnPaginationButtons />
        </PaginationFilterWrapper>
        <div>
          <ColumnHeaders projectId={projectId} taskName={taskName} />
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
  padding-top: ${size.s};
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
