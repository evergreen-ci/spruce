import { IssueLink } from "gql/generated/types";
import { AnnotationTicketRow } from "../AnnotationTicketsTable/AnnotationTicketRow";
import { TicketsTitle } from "../BBComponents";
import FileTicketButton from "../FileTicketButton";

interface CustomCreatedTicketProps {
  taskId: string;
  execution: number;
  tickets: IssueLink[];
}

const CustomCreatedTickets: React.FC<CustomCreatedTicketProps> = ({
  execution,
  taskId,
  tickets,
}) => (
  <>
    <TicketsTitle>Create a New Ticket</TicketsTitle>
    <FileTicketButton taskId={taskId} execution={execution} />
    {tickets?.length > 0 && (
      <>
        <TicketsTitle>Tickets Created From This Task</TicketsTitle>
        {tickets.map(({ confidenceScore, issueKey, jiraTicket, url }) => (
          <AnnotationTicketRow
            confidenceScore={confidenceScore}
            issueKey={issueKey}
            jiraTicket={jiraTicket}
            key={issueKey}
            url={url}
          />
        ))}
      </>
    )}
  </>
);

export default CustomCreatedTickets;
