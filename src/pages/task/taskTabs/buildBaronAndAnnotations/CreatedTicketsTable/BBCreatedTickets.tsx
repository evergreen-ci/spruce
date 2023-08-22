import { JiraTicket } from "gql/generated/types";
import { TicketsTitle, NonTableWrapper } from "../BBComponents";
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
      <NonTableWrapper>
        <TicketsTitle>Create a New Ticket</TicketsTitle>
        <FileTicketButton taskId={taskId} execution={execution} />
      </NonTableWrapper>
    )}
    {tickets?.length > 0 && (
      <>
        <NonTableWrapper>
          <TicketsTitle>Tickets Created From This Task </TicketsTitle>
        </NonTableWrapper>{" "}
        <BuildBaronTable jiraIssues={tickets} />
      </>
    )}
  </>
);

export default BBCreatedTickets;
