import React from "react";
import styled from "@emotion/styled";
import { Table } from "antd";
import { GetTaskQuery } from "gql/generated/types";
import { AnnotationTicketRow } from "./BBComponents";

type AnnotationTickets = GetTaskQuery["task"]["annotation"]["issues"];

const columns = [
  {
    render: (
      text: string,
      { issueKey, url, source, jiraTicket }: AnnotationTickets[0]
    ): JSX.Element => (
      <AnnotationTicketRow
        issueKey={issueKey}
        url={url}
        source={source}
        jiraTicket={jiraTicket}
      />
    ),
  },
];

export const AnnotationTicketsTable: React.FC<{
  jiraIssues: AnnotationTickets;
}> = ({ jiraIssues }) => (
  <TableWrapper>
    <Table
      data-test-id="build-baron-table"
      dataSource={jiraIssues}
      rowKey={({ issueKey }) => issueKey}
      columns={columns}
      pagination={false}
      showHeader={false}
    />
  </TableWrapper>
);

export const TableWrapper = styled.div`
  margin-top: 5px;
`;
