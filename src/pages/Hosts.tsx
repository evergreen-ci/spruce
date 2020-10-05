import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
import { useLocation } from "react-router-dom";
import { useHostsTableAnalytics } from "analytics";
import Badge, { Variant } from "components/Badge";
import { Banners } from "components/Banners";
import { Button } from "components/Button";
import { ErrorBoundary } from "components/ErrorBoundary";
import { UpdateStatusModal } from "components/Hosts";
import { RestartJasper } from "components/Hosts/RestartJasper";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import {
  TableContainer,
  TableControlOuterRow,
  TableControlInnerRow,
  PageWrapper,
} from "components/styles";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import {
  HostsQuery,
  HostsQueryVariables,
  HostSortBy,
  SortDirection,
} from "gql/generated/types";
import { HOSTS } from "gql/queries";
import { withBannersContext } from "hoc/withBannersContext";
import { HostsTable } from "pages/hosts/HostsTable";
import { parseQueryString, getArray, getString } from "utils";
import { getPageFromSearch, getLimitFromSearch } from "utils/url";

const Hosts: React.FC = () => {
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();

  const hostsTableAnalytics = useHostsTableAnalytics();

  const { search } = useLocation();

  const queryVariables = getQueryVariables(search);
  const {
    limit,
    page,
    hostId,
    currentTaskId,
    distroId,
    statuses,
    startedBy,
    sortBy,
    sortDir,
  } = queryVariables;

  const hasFilters =
    hostId || currentTaskId || distroId || statuses.length || startedBy;

  // SELECTED HOST IDS STATE
  const [selectedHostIds, setSelectedHostIds] = useState<string[]>([]);

  // UPDATE STATUS MODAL VISIBILITY STATE
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] = useState<
    boolean
  >(false);

  // HOSTS QUERY
  const { data: hostsData, loading } = useQuery<
    HostsQuery,
    HostsQueryVariables
  >(HOSTS, {
    variables: queryVariables,
  });

  const hosts = hostsData?.hosts;
  const hostItems = hosts?.hosts ?? [];
  const totalHostsCount = hosts?.totalHostsCount ?? 0;
  const filteredHostCount = hosts?.filteredHostsCount ?? 0;

  return (
    <PageWrapper data-cy="hosts-page">
      <Banners
        banners={bannersState}
        removeBanner={dispatchBanner.removeBanner}
      />
      <H2>Evergreen Hosts</H2>
      <ErrorBoundary>
        <TableControlOuterRow>
          <SubtitleDataWrapper>
            <Disclaimer data-cy="filtered-hosts-count">
              {`Showing ${
                hasFilters ? filteredHostCount : totalHostsCount
              } of ${totalHostsCount}`}
            </Disclaimer>
            <HostsSelectionWrapper>
              <Badge variant={Variant.Blue} data-cy="hosts-selection-badge">
                {selectedHostIds.length} Selected
              </Badge>
              <ButtonWrapper>
                <Button
                  dataCy="update-status-button"
                  disabled={selectedHostIds.length === 0}
                  onClick={() => setIsUpdateStatusModalVisible(true)}
                >
                  Update Status
                </Button>
              </ButtonWrapper>
              <ButtonWrapper>
                <RestartJasper selectedHostIds={selectedHostIds} />
              </ButtonWrapper>
            </HostsSelectionWrapper>
          </SubtitleDataWrapper>
          <TableControlInnerRow>
            <Pagination
              dataTestId="tasks-table-pagination"
              pageSize={limit}
              value={page}
              totalResults={hasFilters ? filteredHostCount : totalHostsCount}
            />
            <PageSizeSelector
              dataTestId="tasks-table-page-size-selector"
              value={limit}
              sendAnalyticsEvent={() =>
                hostsTableAnalytics.sendEvent({ name: "Change Page Size" })
              }
            />
          </TableControlInnerRow>
        </TableControlOuterRow>
        <TableContainer hide={false}>
          <HostsTable
            hosts={hostItems}
            sortBy={sortBy}
            sortDir={sortDir}
            selectedHostIds={selectedHostIds}
            setSelectedHostIds={setSelectedHostIds}
            loading={loading}
          />
        </TableContainer>
        <UpdateStatusModal
          dataCy="update-host-status-modal"
          hostIds={selectedHostIds}
          visible={isUpdateStatusModalVisible}
          closeModal={() => setIsUpdateStatusModalVisible(false)}
        />
      </ErrorBoundary>
    </PageWrapper>
  );
};

type QueryParam = keyof HostsQueryVariables;

const getSortBy = (sortByParam: string | string[] = ""): HostSortBy => {
  const sortBy = getString(sortByParam) as HostSortBy;

  return Object.values(HostSortBy).includes(sortBy)
    ? sortBy
    : HostSortBy.Status; // default sortBy value
};

const getSortDir = (sortDirParam: string | string[]): SortDirection => {
  const sortDir = getString(sortDirParam) as SortDirection;

  return Object.values(SortDirection).includes(sortDir)
    ? sortDir
    : SortDirection.Asc; // default sortDir value
};

const getQueryVariables = (search: string): HostsQueryVariables => {
  const {
    hostId,
    distroId,
    currentTaskId,
    statuses,
    startedBy,
    sortBy,
    sortDir,
  } = parseQueryString(search) as { [key in QueryParam]: string | string[] };

  return {
    hostId: getString(hostId),
    distroId: getString(distroId),
    currentTaskId: getString(currentTaskId),
    statuses: getArray(statuses),
    startedBy: getString(startedBy),
    sortBy: getSortBy(sortBy),
    sortDir: getSortDir(sortDir),
    page: getPageFromSearch(search),
    limit: getLimitFromSearch(search),
  };
};

const SubtitleDataWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 70px;
`;
const HostsSelectionWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-left: 32px;
`;
const ButtonWrapper = styled.div`
  margin-left: 24px;
`;

const HostsWithBannersContext = withBannersContext(Hosts);

export { HostsWithBannersContext as Hosts };
