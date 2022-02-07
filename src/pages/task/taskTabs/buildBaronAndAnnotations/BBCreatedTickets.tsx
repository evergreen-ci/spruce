import React from "react";
import { JiraTicket, IssueLink } from "gql/generated/types";
import { TicketsTitle, TitleAndButtons } from "./BBComponents";
import { FileTicket } from "./BBFileTicket";

interface CreatedTicketsProps {
  taskId: string;
  execution: number;
  buildBaronConfigured: boolean;
  tickets: JiraTicket[] | IssueLink[];
}

export const CreatedTickets: React.FC<CreatedTicketsProps> = ({
  taskId,
  execution,
  buildBaronConfigured,
  tickets,
}) => (
  <>
    {tickets?.length > 0 && (
      <>
        <TitleAndButtons>
          {/* @ts-expect-error */}
          <TicketsTitle>Tickets Created From This Task </TicketsTitle>
        </TitleAndButtons>{" "}
      </>
    )}
    {buildBaronConfigured && (
      <TitleAndButtons>
        {/* @ts-expect-error */}
        <TicketsTitle>Create a New Ticket</TicketsTitle>
        <FileTicket taskId={taskId} execution={execution} tickets={tickets} />
      </TitleAndButtons>
    )}
  </>
);

// CUSTOM CREATED TICKETS
interface CustomCreatedTicketProps {
  taskId: string;
  execution: number;
  tickets: JiraTicket[] | IssueLink[];
}

export const CustomCreatedTickets: React.FC<CustomCreatedTicketProps> = ({
  taskId,
  execution,
  tickets,
}) => (
  <>
    {tickets?.length > 0 && (
      <>
        <TitleAndButtons>
          {/* @ts-expect-error */}
          <TicketsTitle>Tickets Created From This Task</TicketsTitle>
        </TitleAndButtons>
      </>
    )}
    <TitleAndButtons>
      {/* @ts-expect-error */}
      <TicketsTitle>Create a New Ticket</TicketsTitle>
      <FileTicket taskId={taskId} execution={execution} tickets={tickets} />
    </TitleAndButtons>
  </>
);
