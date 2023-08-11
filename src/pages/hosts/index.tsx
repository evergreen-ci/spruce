import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import Button from "@leafygreen-ui/button";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
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
  const {
    currentTaskId,
    distroId,
    hostId,
    limit,
    page,
    sortBy,
    sortDir,
    startedBy,
    statuses,
  } = queryVariables;

  const hasFilters =
    hostId || currentTaskId || distroId || statuses.length || startedBy;

  // SELECTED HOST IDS STATE
  const [selectedHostIds, setSelectedHostIds] = useState<string[]>([]);

  const [canRestartJasper, setCanRestartJasper] = useState<boolean>(true);
  const [restartJasperError, setRestartJasperError] = useState<string>("");
  const [canReprovision, setCanReprovision] = useState<boolean>(true);
  const [reprovisionError, setReprovisionError] = useState<string>("");

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
        hosts={hostItems}
        sortBy={sortBy}
        sortDir={sortDir}
        selectedHostIds={selectedHostIds}
        setSelectedHostIds={setSelectedHostIds}
        setCanRestartJasper={setCanRestartJasper}
        setRestartJasperError={setRestartJasperError}
        setCanReprovision={setCanReprovision}
        setReprovisionError={setReprovisionError}
        loading={loading && hostItems.length === 0}
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
