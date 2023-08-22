import { IssueLink } from "gql/generated/types";
import { TicketsTitle, NonTableWrapper } from "../BBComponents";
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
    <NonTableWrapper>
      <TicketsTitle>Create a New Ticket</TicketsTitle>
      <FileTicketButton taskId={taskId} execution={execution} />
    </NonTableWrapper>
    {tickets?.length > 0 && (
      <>
        <NonTableWrapper>
          <TicketsTitle>Tickets Created From This Task</TicketsTitle>
        </NonTableWrapper>
        <CustomCreatedTicketsTable tickets={tickets} />
      </>
    )}
  </>
);

export default CustomCreatedTickets;
