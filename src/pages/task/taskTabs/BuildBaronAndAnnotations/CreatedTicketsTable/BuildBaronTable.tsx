import { Table } from "antd";
import { CreatedTicketsQuery } from "gql/generated/types";
import { JiraTicketRow } from "../BBComponents";

type CreatedTickets = CreatedTicketsQuery["bbGetCreatedTickets"];

const columns = [
  {
    render: (text: string, { fields, key }: CreatedTickets[0]): JSX.Element => (
      <div data-cy="jira-ticket-row">
        <JiraTicketRow jiraKey={key} fields={fields} />
      </div>
    ),
  },
];

const BuildBaronTable: React.FC<{
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

export default BuildBaronTable;
