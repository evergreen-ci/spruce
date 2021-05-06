import React from "react";
import { useQuery } from "@apollo/client";
import { useToastContext } from "context/toast";
import {
  GetCreatedTicketsQuery,
  GetCreatedTicketsQueryVariables,
  IssueLink,
} from "gql/generated/types";
import { GET_CREATED_TICKETS } from "gql/queries";
import { CustomCreatedTicketsTable } from "./AnnotationTicketsTable";
import { TicketsTitle, TitleAndButtons } from "./BBComponents";
import { FileTicket } from "./BBFileTicket";
import { BuildBaronTable } from "./BuildBaronTable";

interface CreatedTicketsProps {
  taskId: string;
  execution: number;
  buildBaronConfigured: boolean;
}

export const CreatedTickets: React.FC<CreatedTicketsProps> = ({
  taskId,
  execution,
  buildBaronConfigured,
}) => {
  const dispatchToast = useToastContext();
  const { data } = useQuery<
    GetCreatedTicketsQuery,
    GetCreatedTicketsQueryVariables
  >(GET_CREATED_TICKETS, {
    variables: { taskId },
    onError(error) {
      dispatchToast.error(
        `There was an error getting tickets created for this task: ${error.message}`
      );
    },
  });
  const length = data?.bbGetCreatedTickets?.length ?? 0;

  return (
    <>
      {length > 0 && (
        <>
          <TitleAndButtons>
            {/* @ts-expect-error */}
            <TicketsTitle>Tickets Created From This Task </TicketsTitle>
          </TitleAndButtons>
          <BuildBaronTable jiraIssues={data?.bbGetCreatedTickets} />{" "}
        </>
      )}
      {buildBaronConfigured && (
        <TitleAndButtons>
          {/* @ts-expect-error */}
          {length === 0 && <TicketsTitle>Create a New Ticket</TicketsTitle>}
          <FileTicket
            taskId={taskId}
            execution={execution}
            tickets={data?.bbGetCreatedTickets}
          />
        </TitleAndButtons>
      )}
    </>
  );
};

// CUSTOM CREATED TICKETS
interface CustomCreatedTicketProps {
  tickets: IssueLink[];
  taskId: string;
  execution: number;
}

export const CustomCreatedTickets: React.FC<CustomCreatedTicketProps> = ({
  tickets,
  taskId,
  execution,
}) => (
  <>
    {tickets?.length > 0 && (
      <>
        <TitleAndButtons>
          {/* @ts-expect-error */}
          <TicketsTitle>Tickets Created From This Task</TicketsTitle>
        </TitleAndButtons>
        <CustomCreatedTicketsTable createdIssues={tickets} />
      </>
    )}
    <TitleAndButtons>
      {/* @ts-expect-error */}
      <TicketsTitle>Create a New Ticket</TicketsTitle>
      <FileTicket taskId={taskId} execution={execution} tickets={tickets} />
    </TitleAndButtons>
  </>
);
