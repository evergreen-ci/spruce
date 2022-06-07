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

const BBCreatedTickets: React.VFC<CreatedTicketsProps> = ({
  taskId,
  execution,
  buildBaronConfigured,
  tickets,
}) => (
  <>
    {buildBaronConfigured && (
      <NonTableWrapper>
        {/* @ts-expect-error */}
        <TicketsTitle>Create a New Ticket</TicketsTitle>
        <FileTicketButton taskId={taskId} execution={execution} />
      </NonTableWrapper>
    )}
    {tickets?.length > 0 && (
      <>
        <NonTableWrapper>
          {/* @ts-expect-error */}
          <TicketsTitle>Tickets Created From This Task </TicketsTitle>
        </NonTableWrapper>{" "}
        <BuildBaronTable jiraIssues={tickets} />
      </>
    )}
  </>
);

export default BBCreatedTickets;
