import React from "react";
import { ApolloError } from "apollo-client";
import { Table } from "antd";
import { getDateCopy } from "utils/string";
import { HostCard } from "pages/host/HostCard";
import { HostEventsQuery, HostEventLogEntry } from "gql/generated/types";
import { ColumnProps } from "antd/es/table";
import { getHostEventString } from "pages/host/getHostEventString";
import styled from "@emotion/styled";
import { Subtitle } from "@leafygreen-ui/typography";

export const HostTable: React.FC<{
  loading: boolean;
  eventData: HostEventsQuery;
  error: ApolloError;
  timeZone: string;
}> = ({ loading, eventData, error, timeZone }) => {
  const hostEvents = eventData?.hostEvents;
  const logEntries = hostEvents?.eventLogEntries;
  const columnsTemplate: Array<ColumnProps<HostEventLogEntry>> = [
    {
      title: "Date",
      dataIndex: "timestamp",
      width: "25%",
      render: (_, { timestamp }: HostEventLogEntry): JSX.Element => (
        <div>{getDateCopy(timestamp, timeZone)}</div>
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

  return (
    <HostCard error={error} loading={loading} metaData={false}>
      <StyledSubtitle>Recent Events </StyledSubtitle>
      <Table
        data-test-id="tests-table"
        dataSource={logEntries}
        rowKey={rowKey}
        columns={columnsTemplate}
        pagination={false}
      />
    </HostCard>
  );
};

const rowKey = (record: HostEventLogEntry, index: number): string => `${index}`;

const StyledSubtitle = styled(Subtitle)`
  margin-bottom: 20px;
  margin-top: 15px;
`;
