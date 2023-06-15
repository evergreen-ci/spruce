import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { ProjectBanner } from "components/Banners";
import FilterBadges, {
  useFilterBadgeQueryParams,
} from "components/FilterBadges";
import {
  context,
  ColumnPaginationButtons,
  HistoryTableTestSearch,
  hooks,
  constants,
} from "components/HistoryTable";
import HistoryTable from "components/HistoryTable/HistoryTable";
import { useHistoryTable } from "components/HistoryTable/HistoryTableContext";
import { PageWrapper } from "components/styles";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
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
  const { ingestNewCommits } = useHistoryTable();
  usePageTitle(`Task History | ${projectIdentifier} | ${taskName}`);
  useTestFilters();
  useJumpToCommit();

  const { badges, handleOnRemove, handleClearAll } = useFilterBadgeQueryParams(
    constants.queryParamsToDisplay
  );
  const dispatchToast = useToastContext();

  const { data, loading, refetch } = useQuery<
    MainlineCommitsForHistoryQuery,
    MainlineCommitsForHistoryQueryVariables
  >(GET_MAINLINE_COMMITS_FOR_HISTORY, {
    variables: {
      mainlineCommitsOptions: {
        projectIdentifier,
        limit: 10,
        shouldCollapse: true,
      },
      buildVariantOptions: {
        tasks: [applyStrictRegex(taskName)],
        includeBaseTasks: false,
      },
    },
    fetchPolicy: "no-cache", // This is because we already cache the data in the history table
    onCompleted({ mainlineCommits }) {
      ingestNewCommits(mainlineCommits);
    },
    onError(err) {
      dispatchToast.error(
        `There was an error loading the task history: ${err.message}`
      );
    },
  });

  const handleLoadMore = () => {
    if (data) {
      refetch({
        mainlineCommitsOptions: {
          projectIdentifier,
          limit: 10,
          skipOrderNumber: data.mainlineCommits?.nextPageOrderNumber,
          shouldCollapse: true,
        },
        buildVariantOptions: {
          tasks: [applyStrictRegex(taskName)],
          includeBaseTasks: false,
        },
      });
    }
  };

  return (
    <PageWrapper>
      <ProjectBanner projectIdentifier={projectIdentifier} />
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
            <HistoryTable
              loadMoreItems={handleLoadMore}
              loading={loading}
              finalRowCopy="End of task history"
            >
              {TaskHistoryRow}
            </HistoryTable>
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
