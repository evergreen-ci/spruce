import { Table } from "antd";
import AnnotationTicketRow from "../AnnotationTicketsList/AnnotationTicketRow";
import {
  AnnotationTickets,
  AnnotationTicket,
} from "../AnnotationTicketsList/types";

// CREATED TICKETS
interface CreatedTicketsProps {
  tickets: AnnotationTickets;
}

const CustomCreatedTicketsTable: React.FC<CreatedTicketsProps> = ({
  tickets,
}) => {
  const columns = [
    {
      title: "Ticket",
      render: ({
        confidenceScore,
        issueKey,
        jiraTicket,
        url,
      }: AnnotationTicket): JSX.Element => (
        <AnnotationTicketRow
          issueKey={issueKey}
          url={url}
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
      dataSource={tickets}
      rowKey={({ issueKey }) => issueKey}
      columns={columns}
      pagination={false}
      showHeader={false}
    />
  );
};

export default CustomCreatedTicketsTable;
