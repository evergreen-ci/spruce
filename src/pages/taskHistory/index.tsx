import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import FilterBadges, {
  useFilterBadgeQueryParams,
} from "components/FilterBadges";
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
import BuildVariantSelector from "./BuildVariantSelector";
import ColumnHeaders from "./ColumnHeaders";
import TaskHistoryRow from "./TaskHistoryRow";

const { HistoryTableProvider } = context;
const { applyStrictRegex } = string;
const { useTestFilters, useJumpToCommit } = hooks;

const TaskHistoryContents: React.VFC = () => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Task history" });
  const { projectIdentifier, taskName } = useParams<{
    projectIdentifier: string;
    taskName: string;
  }>();
  usePageTitle(`Task History | ${projectIdentifier} | ${taskName}`);
  const [nextPageOrderNumber, setNextPageOrderNumber] = useState(null);
  useTestFilters();
  useJumpToCommit();

  const { badges, handleOnRemove, handleClearAll } = useFilterBadgeQueryParams(
    constants.queryParamsToDisplay
  );
  const { data, error } = useQuery<
    MainlineCommitsForHistoryQuery,
    MainlineCommitsForHistoryQueryVariables
  >(GET_MAINLINE_COMMITS_FOR_HISTORY, {
    variables: {
      mainlineCommitsOptions: {
        projectIdentifier,
        limit: 10,
        skipOrderNumber: nextPageOrderNumber,
        shouldCollapse: true,
      },
      buildVariantOptions: {
        tasks: [applyStrictRegex(taskName)],
        includeBaseTasks: false,
      },
    },
  });

  const { mainlineCommits } = data || {};

  return (
    <PageWrapper>
      <CenterPage>
        <PageHeader>
          <H2>Task Name: {taskName}</H2>
          <PageHeaderContent>
            <HistoryTableTestSearch
              onSubmit={() => {
                sendEvent({
                  name: "Submit failed test filter",
                });
              }}
            />
            <BuildVariantSelector
              projectIdentifier={projectIdentifier}
              taskName={taskName}
            />
          </PageHeaderContent>
        </PageHeader>
        <PaginationFilterWrapper>
          <BadgeWrapper>
            <FilterBadges
              badges={badges}
              onRemove={(b) => {
                sendEvent({ name: "Remove badge" });
                handleOnRemove(b);
              }}
              onClearAll={() => {
                sendEvent({ name: "Clear all badges" });
                handleClearAll();
              }}
            />
          </BadgeWrapper>
          <ColumnPaginationButtons
            onClickNext={() =>
              sendEvent({ name: "Paginate", direction: "next" })
            }
            onClickPrev={() =>
              sendEvent({ name: "Paginate", direction: "previous" })
            }
          />
        </PaginationFilterWrapper>
        <div>
          <ColumnHeaders
            projectIdentifier={projectIdentifier}
            taskName={taskName}
          />

          <TableWrapper>
            {error && <div>Failed to retrieve mainline commit history.</div>}
            {!error && (
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
            )}
          </TableWrapper>
        </div>
      </CenterPage>
    </PageWrapper>
  );
};

const TaskHistory = () => (
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

export default TaskHistory;
