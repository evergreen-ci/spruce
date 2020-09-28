import React from "react";
import { Table } from "antd";
import { GetCreatedTicketsQuery } from "gql/generated/types";
import { JiraTicketRow } from "./BBComponents";

type CreatedTickets = GetCreatedTicketsQuery["bbGetCreatedTickets"];

const columns = [
  {
    render: (text: string, { key, fields }: CreatedTickets[0]): JSX.Element => (
      <div>
        <JiraTicketRow jiraKey={key} fields={fields} />
      </div>
    ),
  },
];

export const BuildBaronTable: React.FC<{
  jiraIssues: CreatedTickets;
}> = ({ jiraIssues }) => (
  <Table
    data-test-id="build-baron-table"
    dataSource={jiraIssues}
    rowKey={({ key }) => key}
    columns={columns}
    pagination={false}
    showHeader={false}
  />
);
