import { IssueLink } from "gql/generated/types";
import { TicketsTitle, NonTableWrapper } from "../BBComponents";
import FileTicketButton from "../FileTicketButton";
import CustomCreatedTicketsTable from "./CustomCreatedTicketsTable";

interface CustomCreatedTicketProps {
  taskId: string;
  execution: number;
  tickets: IssueLink[];
}

const CustomCreatedTickets: React.VFC<CustomCreatedTicketProps> = ({
  taskId,
  execution,
  tickets,
}) => (
  <>
    <NonTableWrapper>
      {/* @ts-expect-error */}
      <TicketsTitle>Create a New Ticket</TicketsTitle>
      <FileTicketButton taskId={taskId} execution={execution} />
    </NonTableWrapper>
    {tickets?.length > 0 && (
      <>
        <NonTableWrapper>
          {/* @ts-expect-error */}
          <TicketsTitle>Tickets Created From This Task</TicketsTitle>
        </NonTableWrapper>
        <CustomCreatedTicketsTable tickets={tickets} />
      </>
    )}
  </>
);

export default CustomCreatedTickets;
