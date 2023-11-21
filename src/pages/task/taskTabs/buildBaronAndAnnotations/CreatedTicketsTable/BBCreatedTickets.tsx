import { JiraTicket } from "gql/generated/types";
import { TicketsTitle } from "../BBComponents";
import FileTicketButton from "../FileTicketButton";
import BuildBaronTable from "./BuildBaronTable";

interface CreatedTicketsProps {
  taskId: string;
  execution: number;
  buildBaronConfigured: boolean;
  tickets: JiraTicket[];
}

const BBCreatedTickets: React.FC<CreatedTicketsProps> = ({
  buildBaronConfigured,
  execution,
  taskId,
  tickets,
}) => (
  <>
    {buildBaronConfigured && (
      <>
        <TicketsTitle>Create a New Ticket</TicketsTitle>
        <FileTicketButton taskId={taskId} execution={execution} />
      </>
    )}
    {tickets?.length > 0 && (
      <>
        <TicketsTitle>Tickets Created From This Task </TicketsTitle>
        <BuildBaronTable jiraIssues={tickets} />
      </>
    )}
  </>
);

export default BBCreatedTickets;
