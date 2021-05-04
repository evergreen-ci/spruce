import React from "react";
import { useQuery } from "@apollo/client";
import { useToastContext } from "context/toast";
import {
  GetCustomCreatedIssuesQuery,
  GetCustomCreatedIssuesQueryVariables,
  GetCreatedTicketsQuery,
  GetCreatedTicketsQueryVariables,
} from "gql/generated/types";
import {
  GET_CREATED_TICKETS,
  GET_JIRA_CUSTOM_CREATED_ISSUES,
} from "gql/queries";
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
  const tickets = data?.bbGetCreatedTickets;
  return (
    <>
      {length > 0 && (
        <>
          <TitleAndButtons>
            {/* @ts-expect-error */}
            <TicketsTitle>Tickets Created From This Task </TicketsTitle>
          </TitleAndButtons>
          <BuildBaronTable jiraIssues={tickets} />{" "}
        </>
      )}
      {buildBaronConfigured && (
        <TitleAndButtons>
          {/* @ts-expect-error */}
          {length === 0 && <TicketsTitle>Create a New Ticket</TicketsTitle>}
          <FileTicket taskId={taskId} execution={execution} tickets={tickets} />
        </TitleAndButtons>
      )}
    </>
  );
};

// CUSTOM CREATED TICKETS
interface CustomCreatedTicketProps {
  taskId: string;
  execution: number;
}

export const CustomCreatedTickets: React.FC<CustomCreatedTicketProps> = ({
  taskId,
  execution,
}) => {
  const dispatchToast = useToastContext();
  const { data } = useQuery<
    GetCustomCreatedIssuesQuery,
    GetCustomCreatedIssuesQueryVariables
  >(GET_JIRA_CUSTOM_CREATED_ISSUES, {
    variables: { taskId, execution },
    onError: (err) => {
      dispatchToast.error(
        `There was an error loading the ticket information from Jira: ${err.message}`
      );
    },
  });
  const tickets = data?.task?.annotation?.createdIssues;

  return (
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
        <FileTicket taskId={taskId} execution={execution} />
      </TitleAndButtons>
    </>
  );
};
