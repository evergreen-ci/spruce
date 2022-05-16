import React from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Subtitle } from "@leafygreen-ui/typography";
import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { useHostsTableAnalytics } from "analytics";
import PageSizeSelector, {
  usePageSizeSelector,
} from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { size } from "constants/tokens";
import { HostEventsQuery, HostEventLogEntry } from "gql/generated/types";
import { getHostEventString } from "pages/host/getHostEventString";
import { HostCard } from "pages/host/HostCard";
import { string } from "utils";

const { getDateCopy } = string;

export const HostTable: React.VFC<{
  loading: boolean;
  eventData: HostEventsQuery;
  error: ApolloError;
  timeZone: string;
  page: number;
  limit: number;
  eventsCount: number;
}> = ({ loading, eventData, error, timeZone, page, limit, eventsCount }) => {
  const isHostPage = true;
  const hostsTableAnalytics = useHostsTableAnalytics(isHostPage);
  const setPageSize = usePageSizeSelector();

  const hostEvents = eventData?.hostEvents;
  const logEntries = hostEvents?.eventLogEntries;
  const columnsTemplate: Array<ColumnProps<HostEventLogEntry>> = [
    {
      title: "Date",
      dataIndex: "timestamp",
      width: "25%",
      render: (_, { eventType, timestamp }: HostEventLogEntry): JSX.Element => (
        <div data-cy={`${eventType}-time`}>
          {getDateCopy(timestamp, { tz: timeZone })}
        </div>
      ),
    },
    {
      title: "Event",
      dataIndex: "data",
      width: "75%",
      render: (_, { eventType, data }: HostEventLogEntry): JSX.Element => (
        <div>{getHostEventString(eventType, data)}</div>
      ),
    },
  ];

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
            pageSize={limit}
            value={page}
            totalResults={eventsCount}
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
        dataSource={logEntries}
        rowKey={rowKey}
        columns={columnsTemplate}
        pagination={false}
      />
    </HostCard>
  );
};

const rowKey = (record: HostEventLogEntry): string => `${record.id}`;

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
  justify-content: flex-end;
  align-items: center;
`;
