import styled from "@emotion/styled";
import { size } from "constants/tokens";
import { IssueLink } from "gql/generated/types";
import AnnotationTicketRow from "../AnnotationTicketsList/AnnotationTicketRow";
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
    {!!tickets?.length && (
      <>
        <TicketsTitle margin>Tickets Created From This Task</TicketsTitle>
        <TicketContainer>
          {tickets.map(({ confidenceScore, issueKey, jiraTicket, url }) => (
            <AnnotationTicketRow
              confidenceScore={confidenceScore}
              issueKey={issueKey}
              jiraTicket={jiraTicket}
              key={issueKey}
              url={url}
            />
          ))}
        </TicketContainer>
      </>
    )}
  </>
);

const TicketContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.s};
`;

export default CustomCreatedTickets;
