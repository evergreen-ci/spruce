import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Table, TableHeader, Row, Cell } from "@leafygreen-ui/table";
import { Subtitle } from "@leafygreen-ui/typography";
import { useHostsTableAnalytics } from "analytics";
import PageSizeSelector, {
  usePageSizeSelector,
} from "components/PageSizeSelector";
import Pagination from "components/Pagination";
import { size } from "constants/tokens";
import { HostEventsQuery } from "gql/generated/types";
import { useDateFormat } from "hooks";
import { getHostEventString } from "pages/host/getHostEventString";
import { HostCard } from "pages/host/HostCard";

export const HostTable: React.VFC<{
  loading: boolean;
  eventData: HostEventsQuery;
  error: ApolloError;
  page: number;
  limit: number;
  eventsCount: number;
}> = ({ loading, eventData, error, page, limit, eventsCount }) => {
  const isHostPage = true;
  const hostsTableAnalytics = useHostsTableAnalytics(isHostPage);
  const setPageSize = usePageSizeSelector();
  const getDateCopy = useDateFormat();
  const hostEvents = eventData?.hostEvents;
  const logEntries = hostEvents?.eventLogEntries;

  const handlePageSizeChange = (pageSize: number): void => {
    setPageSize(pageSize);
    hostsTableAnalytics.sendEvent({ name: "Change Page Size" });
  };

  return (
    <HostCard error={error} loading={loading} metaData={false}>
      <TableTitle>
        {/* @ts-expect-error */}
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
      <Table
        data-cy="host-events-table"
        data={logEntries}
        columns={[
          <TableHeader key="date" dataType="date" label="Date" />,
          <TableHeader key="event" label="Event" />,
        ]}
      >
        {({ datum }) => (
          <Row data-cy={`event-type-${datum.eventType}`} key={datum.id}>
            <Cell data-cy={`${datum.eventType}-time`}>
              {getDateCopy(datum.timestamp)}
            </Cell>
            <Cell>{getHostEventString(datum.eventType, datum.data)}</Cell>
          </Row>
        )}
      </Table>
    </HostCard>
  );
};

// @ts-expect-error
const StyledSubtitle = styled(Subtitle)`
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
