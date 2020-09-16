import React from "react";
import { Table } from "antd";
import { JiraTicket } from "gql/generated/types";
import { JiraTicketRow } from "./BBComponents";

const columns = [
  {
    render: (text: string, { key, fields }: JiraTicket): JSX.Element => (
      <div>
        <JiraTicketRow jiraKey={key} fields={fields} />
      </div>
    ),
  },
];

export const BuildBaronTable: React.FC<{
  jiraIssues: JiraTicket[];
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
