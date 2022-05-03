import { Table } from "antd";
import { AnnotationTicketRow } from "../AnnotationTicketsTable/AnnotationTicketRow";
import {
  AnnotationTickets,
  AnnotationTicket,
} from "../AnnotationTicketsTable/types";

// CREATED TICKETS
interface CreatedTicketsProps {
  tickets: AnnotationTickets;
}

const CustomCreatedTicketsTable: React.VFC<CreatedTicketsProps> = ({
  tickets,
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
      dataSource={tickets}
      rowKey={({ issueKey }) => issueKey}
      columns={columns}
      pagination={false}
      showHeader={false}
    />
  );
};

export default CustomCreatedTicketsTable;
