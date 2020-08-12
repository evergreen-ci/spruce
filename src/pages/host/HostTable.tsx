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

// TABLE COLUMNS
const columnsTemplate: Array<ColumnProps<HostEventLogEntry>> = [
  {
    title: "Date",
    dataIndex: "timestamp",
    width: 230,
    render: (_, { timestamp }: HostEventLogEntry): JSX.Element => (
      <div>{getDateCopy(timestamp)}</div>
    ),
  },
  {
    title: "Event",
    dataIndex: "data",
    render: (_, { eventType, data }: HostEventLogEntry): JSX.Element => (
      <div>{getHostEventString(eventType, data)}</div>
    ),
  },
];

const rowKey = (record: HostEventLogEntry, index: number): string => `${index}`;

export const HostTable: React.FC<{
  loading: boolean;
  data: HostEventsQuery;
  error: ApolloError;
}> = ({ loading, data, error }) => {
  const hostEvents = data?.hostEvents;
  const logEntries = hostEvents?.eventLogEntries;
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

const StyledSubtitle = styled(Subtitle)`
  margin-bottom: 20px;
  margin-top: 15px;
`;
