import React, { useState, useEffect } from "react";
import { Skeleton } from "antd";
import { useQuery } from "@apollo/react-hooks";
import { useLocation } from "react-router-dom";
import {
  TableContainer,
  TableControlOuterRow,
  TableControlInnerRow,
  PageWrapper,
} from "components/styles";
import { withBannersContext } from "hoc/withBannersContext";
import { Banners } from "components/Banners";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { H2 } from "@leafygreen-ui/typography";
import { ErrorBoundary } from "components/ErrorBoundary";
import {
  HostsQuery,
  HostsQueryVariables,
  HostSortBy,
  SortDirection,
  Host,
} from "gql/generated/types";
import { HOSTS } from "gql/queries";
import { useDisableTableSortersIfLoading, usePrevious } from "hooks";
import { getPageFromSearch, getLimitFromSearch } from "utils/url";
import { parseQueryString, getArray, getString } from "utils";
import { Pagination } from "components/Pagination";
import { PageSizeSelector } from "components/PageSizeSelector";
import { isNetworkRequestInFlight } from "apollo-client/core/networkStatus";
import { HostsTable } from "pages/hosts/HostsTable";

const Hosts: React.FC = () => {
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();

  const { search } = useLocation();
  const prevSearch = usePrevious<string>(search);
  const searchChanged = search !== prevSearch;

  const [initialQueryVariables] = useState<HostsQueryVariables>(
    getQueryVariables(search)
  );

  // HOSTS QUERY
  const { data: hostsData, networkStatus, refetch } = useQuery<
    HostsQuery,
    HostsQueryVariables
  >(HOSTS, {
    variables: initialQueryVariables,
    notifyOnNetworkStatusChange: true,
  });

  // REFETCH HOSTS QUERY IF SEARCH CHANGES
  useEffect(() => {
    if (searchChanged) {
      refetch(getQueryVariables(search));
    }
  }, [searchChanged, search, refetch]);

  const hosts = hostsData?.hosts;
  const hostItems = (hosts?.hosts as Host[]) ?? [];
  const totalHostsCount = hosts?.totalHostsCount ?? 0;
  const filteredHostCount = hosts?.filteredHostsCount ?? 0;

  useDisableTableSortersIfLoading(networkStatus);

  const {
    limit,
    page,
    hostId,
    currentTaskId,
    distroId,
    statuses,
    startedBy,
  } = getQueryVariables(search);

  const hasFilters =
    hostId || currentTaskId || distroId || statuses.length || startedBy;

  const isLoading = isNetworkRequestInFlight(networkStatus);

  return (
    <PageWrapper data-cy="hosts-page">
      <Banners
        banners={bannersState}
        removeBanner={dispatchBanner.removeBanner}
      />
      <H2>Evergreen Hosts</H2>
      <ErrorBoundary>
        <TableControlOuterRow>
          <div data-cy="filtered-hosts-count">
            {hasFilters && `Showing ${filteredHostCount} of ${totalHostsCount}`}
          </div>
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
            />
          </TableControlInnerRow>
        </TableControlOuterRow>
        <TableContainer hide={isLoading}>
          <HostsTable hosts={hostItems} />
        </TableContainer>
        {isLoading && <Skeleton active title={false} paragraph={{ rows: 8 }} />}
      </ErrorBoundary>
    </PageWrapper>
  );
};

type QueryParam = keyof HostsQueryVariables;

const getSortBy = (sortByParam: string | string[] = ""): HostSortBy => {
  const sortBy = getString(sortByParam) as HostSortBy;

  return Object.values(HostSortBy).includes(sortBy)
    ? sortBy
    : HostSortBy.Status;
};

const getSortDir = (sortDirParam: string | string[]): SortDirection => {
  const sortDir = getString(sortDirParam) as SortDirection;

  return Object.values(SortDirection).includes(sortDir)
    ? sortDir
    : SortDirection.Asc;
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

const HostsWithBannersContext = withBannersContext(Hosts);

export { HostsWithBannersContext as Hosts };
