import { Table } from "antd";
import { AnnotationTicketRow } from "./AnnotationTicketRow";
import { AnnotationTickets, AnnotationTicket } from "./types";

// CREATED TICKETS
interface CreatedTicketsProps {
  createdIssues: AnnotationTickets;
}

const CustomCreatedTicketsTable: React.VFC<CreatedTicketsProps> = ({
  createdIssues,
}) => {
  const columns = [
    {
      title: "Ticket",
      render: ({
        issueKey,
        url,
        confidenceScore,
        source,
        jiraTicket,
      }: AnnotationTicket): JSX.Element => (
        <AnnotationTicketRow
          issueKey={issueKey}
          url={url}
          source={source}
          confidenceScore={confidenceScore}
          jiraTicket={jiraTicket}
        />
      ),
    },
  ];

  return (
    <Table
      tableLayout="fixed"
      data-test-id="created-issues-table"
      dataSource={createdIssues}
      rowKey={({ issueKey }) => issueKey}
      columns={columns}
      pagination={false}
      showHeader={false}
    />
  );
};

export default CustomCreatedTicketsTable;
