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
import { MAINLINE_COMMITS_FOR_HISTORY } from "gql/queries";
import { usePageTitle } from "hooks";
import { string } from "utils";
import { leaveBreadcrumb, SentryBreadcrumb } from "utils/errorReporting";
import ColumnHeaders from "./ColumnHeaders";
import TaskSelector from "./TaskSelector";
import VariantHistoryRow from "./VariantHistoryRow";

const { HistoryTableProvider } = context;
const { useJumpToCommit, useTestFilters } = hooks;
const { applyStrictRegex } = string;

const VariantHistoryContents: React.FC = () => {
  const { projectIdentifier, variantName } = useParams<{
    projectIdentifier: string;
    variantName: string;
  }>();
  const { sendEvent } = useProjectHealthAnalytics({ page: "Variant history" });
  const { ingestNewCommits } = useHistoryTable();
  const dispatchToast = useToastContext();
  usePageTitle(`Variant History | ${projectIdentifier} | ${variantName}`);
  useJumpToCommit();
  useTestFilters();
  const { badges, handleClearAll, handleOnRemove } = useFilterBadgeQueryParams(
    constants.queryParamsToDisplay,
  );
  const { data, loading, refetch } = useQuery<
    MainlineCommitsForHistoryQuery,
    MainlineCommitsForHistoryQueryVariables
  >(MAINLINE_COMMITS_FOR_HISTORY, {
    variables: {
      mainlineCommitsOptions: {
        projectIdentifier,
        limit: 10,
        shouldCollapse: true,
      },
      buildVariantOptions: {
        variants: [applyStrictRegex(variantName)],
        includeBaseTasks: false,
      },
    },
    notifyOnNetworkStatusChange: true, // This is so that we can show the loading state
    fetchPolicy: "no-cache", // This is because we already cache the data in the history table
    onCompleted({ mainlineCommits }) {
      leaveBreadcrumb(
        "Loaded more commits for variant history",
        {
          projectIdentifier,
          variantName,
          numCommits: mainlineCommits.versions.length,
        },
        SentryBreadcrumb.UI,
      );
      ingestNewCommits(mainlineCommits);
    },
    onError(err) {
      dispatchToast.error(
        `There was an error loading the variant history: ${err.message}`,
      );
    },
  });

  const handleLoadMore = () => {
    if (data) {
      leaveBreadcrumb(
        "Requesting more variant history",
        {
          projectIdentifier,
          variantName,
          skipOrderNumber: data.mainlineCommits?.nextPageOrderNumber,
        },
        SentryBreadcrumb.UI,
      );
      refetch({
        mainlineCommitsOptions: {
          projectIdentifier,
          limit: 10,
          skipOrderNumber: data.mainlineCommits?.nextPageOrderNumber,
          shouldCollapse: true,
        },
        buildVariantOptions: {
          variants: [applyStrictRegex(variantName)],
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
          <H2>Build Variant: {variantName}</H2>
          <PageHeaderContent>
            <HistoryTableTestSearch
              onSubmit={() => {
                sendEvent({
                  name: "Submit failed test filter",
                });
              }}
            />
            <TaskSelector
              projectIdentifier={projectIdentifier}
              buildVariant={variantName}
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
            variantName={variantName}
          />
          <TableWrapper>
            <HistoryTable
              loadMoreItems={handleLoadMore}
              loading={loading}
              finalRowCopy="End of variant history"
            >
              {VariantHistoryRow}
            </HistoryTable>
          </TableWrapper>
        </div>
      </CenterPage>
    </PageWrapper>
  );
};

const VariantHistory = () => (
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

export default VariantHistory;
