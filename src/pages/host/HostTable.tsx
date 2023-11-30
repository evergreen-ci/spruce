import { useMemo } from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import {
  V10Table as Table,
  V10TableHeader as TableHeader,
  V10HeaderRow as HeaderRow,
  V10Row as Row,
  V10Cell as Cell,
  V11Adapter,
} from "@leafygreen-ui/table";
import { Subtitle, SubtitleProps } from "@leafygreen-ui/typography";
import { useHostsTableAnalytics } from "analytics";
import PageSizeSelector, {
  usePageSizeSelector,
} from "components/PageSizeSelector";
import Pagination from "components/Pagination";
import { size } from "constants/tokens";
import { HostEventsQuery } from "gql/generated/types";
import { useDateFormat } from "hooks";
import { HostCard } from "pages/host/HostCard";
import { HostEventString } from "pages/host/HostEventString";

export const HostTable: React.FC<{
  loading: boolean;
  eventData: HostEventsQuery;
  error: ApolloError;
  page: number;
  limit: number;
  eventsCount: number;
}> = ({ error, eventData, eventsCount, limit, loading, page }) => {
  const isHostPage = true;
  const hostsTableAnalytics = useHostsTableAnalytics(isHostPage);
  const setPageSize = usePageSizeSelector();
  const getDateCopy = useDateFormat();
  const logEntries = useMemo(
    () => eventData?.hostEvents?.eventLogEntries ?? [],
    [eventData?.hostEvents?.eventLogEntries]
  );

  const handlePageSizeChange = (pageSize: number): void => {
    setPageSize(pageSize);
    hostsTableAnalytics.sendEvent({ name: "Change Page Size" });
  };

  return (
    <HostCard error={error} loading={loading} metaData={false}>
      <TableTitle>
        <StyledSubtitle>Recent Events </StyledSubtitle>
        <PaginationWrapper>
          <Pagination
            data-cy="host-event-table-pagination"
            currentPage={page}
            totalResults={eventsCount}
            pageSize={limit}
          />
          <PageSizeSelector
            data-cy="host-event-table-page-size-selector"
            value={limit}
            onChange={handlePageSizeChange}
          />
        </PaginationWrapper>
      </TableTitle>
      <V11Adapter shouldAlternateRowColor>
        <Table
          data-cy="host-events-table"
          data={logEntries}
          columns={
            <HeaderRow>
              <TableHeader key="date" dataType="date" label="Date" />
              <TableHeader key="event" label="Event" />
            </HeaderRow>
          }
        >
          {({ datum }) => (
            <Row data-cy={`event-type-${datum.eventType}`} key={datum.id}>
              <Cell data-cy={`${datum.eventType}-time`}>
                {getDateCopy(datum.timestamp)}
              </Cell>
              <Cell>
                <HostEventString
                  eventType={datum.eventType}
                  data={datum.data}
                />
              </Cell>
            </Row>
          )}
        </Table>
      </V11Adapter>
    </HostCard>
  );
};

const StyledSubtitle = styled(Subtitle)<SubtitleProps>`
  margin-bottom: 20px;
  margin-top: ${size.s};
`;

const TableTitle = styled.div`
  flex-wrap: nowrap;
  display: flex;
  justify-content: space-between;
`;

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
`;
