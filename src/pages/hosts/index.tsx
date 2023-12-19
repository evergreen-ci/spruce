import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import Button from "@leafygreen-ui/button";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { useLocation } from "react-router-dom";
import { useHostsTableAnalytics } from "analytics";
import { UpdateStatusModal } from "components/Hosts";
import { Reprovision } from "components/Hosts/Reprovision";
import { RestartJasper } from "components/Hosts/RestartJasper";
import PageSizeSelector, {
  usePageSizeSelector,
} from "components/PageSizeSelector";
import Pagination from "components/Pagination";
import {
  TableControlOuterRow,
  TableControlInnerRow,
  PageWrapper,
} from "components/styles";
import { size } from "constants/tokens";
import {
  HostsQuery,
  HostsQueryVariables,
  HostSortBy,
  SortDirection,
} from "gql/generated/types";
import { HOSTS } from "gql/queries";
import { usePageTitle } from "hooks";
import { HostsTable } from "pages/hosts/HostsTable";
import { mapQueryParamToId } from "types/host";
import { array, queryString, url } from "utils";

const { toArray } = array;
const { getLimitFromSearch, getPageFromSearch } = url;
const { getString, parseQueryString } = queryString;

const Hosts: React.FC = () => {
  const hostsTableAnalytics = useHostsTableAnalytics();
  usePageTitle("Hosts");
  const { search } = useLocation();
  const setPageSize = usePageSizeSelector();
  const queryVariables = getQueryVariables(search);
  const { currentTaskId, distroId, hostId, limit, page, startedBy, statuses } =
    queryVariables;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialFilters = useMemo(() => getFilters(queryVariables), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialSorting = useMemo(() => getSorting(queryVariables), []);

  const hasFilters =
    hostId || currentTaskId || distroId || statuses.length || startedBy;

  const [selectedHosts, setSelectedHosts] = useState([]);

  const {
    canReprovision,
    canRestartJasper,
    reprovisionError,
    restartJasperError,
    selectedHostIds,
  } = useMemo(() => {
    let canRestart = true;
    let canRepro = true;

    let restartJasperErrorMessage = "Jasper cannot be restarted for:";
    let reprovisionErrorMessage =
      "The following hosts cannot be reprovisioned:";
    const errorHosts = [];
    selectedHosts.forEach((host) => {
      const bootstrapMethod = host?.distro?.bootstrapMethod;
      if (
        !(
          host?.status === "running" &&
          (bootstrapMethod === "ssh" || bootstrapMethod === "user-data")
        )
      ) {
        canRestart = false;
        canRepro = false;
        errorHosts.push(` ${host?.id}`);
      }
    });
    restartJasperErrorMessage += ` ${errorHosts}`;
    reprovisionErrorMessage += ` ${errorHosts}`;

    const hostIds = selectedHosts.map(({ id }) => id);

    return {
      canReprovision: canRepro,
      canRestartJasper: canRestart,
      reprovisionError: reprovisionErrorMessage,
      restartJasperError: restartJasperErrorMessage,
      selectedHostIds: hostIds,
    };
  }, [selectedHosts]);

  const handlePageSizeChange = (pageSize: number): void => {
    setPageSize(pageSize);
    hostsTableAnalytics.sendEvent({ name: "Change Page Size" });
  };

  // UPDATE STATUS MODAL VISIBILITY STATE
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] =
    useState<boolean>(false);

  // HOSTS QUERY
  const { data: hostsData, loading } = useQuery<
    HostsQuery,
    HostsQueryVariables
  >(HOSTS, {
    variables: queryVariables,
    fetchPolicy: "cache-and-network",
  });

  const hosts = hostsData?.hosts;
  const hostItems = hosts?.hosts ?? [];
  const totalHostsCount = hosts?.totalHostsCount ?? 0;
  const filteredHostCount = hosts?.filteredHostsCount ?? 0;

  return (
    <PageWrapper data-cy="hosts-page">
      <H2>Evergreen Hosts</H2>
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
                data-cy="update-status-button"
                disabled={selectedHostIds.length === 0}
                onClick={() => setIsUpdateStatusModalVisible(true)}
              >
                Update Status
              </Button>
            </ButtonWrapper>
            <ButtonWrapper>
              <RestartJasper
                selectedHostIds={selectedHostIds}
                canRestartJasper={canRestartJasper}
                jasperTooltipMessage={restartJasperError}
              />
            </ButtonWrapper>
            <ButtonWrapper>
              <Reprovision
                selectedHostIds={selectedHostIds}
                canReprovision={canReprovision}
                reprovisionTooltipMessage={reprovisionError}
              />
            </ButtonWrapper>
          </HostsSelectionWrapper>
        </SubtitleDataWrapper>
        <TableControlInnerRow>
          <Pagination
            data-cy="hosts-table-pagination"
            currentPage={page}
            totalResults={hasFilters ? filteredHostCount : totalHostsCount}
            pageSize={limit}
          />
          <PageSizeSelector
            data-cy="hosts-table-page-size-selector"
            value={limit}
            onChange={handlePageSizeChange}
          />
        </TableControlInnerRow>
      </TableControlOuterRow>
      <HostsTable
        initialFilters={initialFilters}
        initialSorting={initialSorting}
        hosts={hostItems}
        loading={loading && hostItems.length === 0}
        limit={limit}
        setSelectedHosts={setSelectedHosts}
      />
      <UpdateStatusModal
        data-cy="update-host-status-modal"
        hostIds={selectedHostIds}
        visible={isUpdateStatusModalVisible}
        closeModal={() => setIsUpdateStatusModalVisible(false)}
      />
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
    currentTaskId,
    distroId,
    hostId,
    sortBy,
    sortDir,
    startedBy,
    statuses,
  } = parseQueryString(search) as { [key in QueryParam]: string | string[] };

  return {
    hostId: getString(hostId),
    distroId: getString(distroId),
    currentTaskId: getString(currentTaskId),
    statuses: toArray(statuses),
    startedBy: getString(startedBy),
    sortBy: getSortBy(sortBy),
    sortDir: getSortDir(sortDir),
    page: getPageFromSearch(search),
    limit: getLimitFromSearch(search),
  };
};

/**
 * `getFilters` converts query param values into react-table's column filters state.
 * @param queryParams - query params from the URL
 * @returns - react-table's filtering state
 */
const getFilters = (queryParams: HostsQueryVariables): ColumnFiltersState =>
  Object.entries(mapQueryParamToId).reduce((accum, [param, id]) => {
    if (queryParams[param]?.length) {
      return [...accum, { id, value: queryParams[param] }];
    }
    return accum;
  }, []);

/**
 * `getSorting` converts query param values into react-table's sorting state.
 * @param queryParams - query params from the URL
 * @param queryParams.sortBy - key indicating the field that is being sorted
 * @param queryParams.sortDir - direction of the sort
 * @returns - react-table's sorting state
 */
const getSorting = ({ sortBy, sortDir }: HostsQueryVariables): SortingState => [
  { id: sortBy, desc: sortDir === SortDirection.Desc },
];

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
  margin-left: ${size.l};
`;
const ButtonWrapper = styled.div`
  margin-left: ${size.m};
`;

export default Hosts;
