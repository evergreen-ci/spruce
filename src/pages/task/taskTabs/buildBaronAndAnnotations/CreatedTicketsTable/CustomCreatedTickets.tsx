import { IssueLink } from "gql/generated/types";
import { TicketsTitle } from "../BBComponents";
import FileTicketButton from "../FileTicketButton";
import CustomCreatedTicketsTable from "./CustomCreatedTicketsTable";

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
        <CustomCreatedTicketsTable tickets={tickets} />
      </>
    )}
  </>
);

export default CustomCreatedTickets;
