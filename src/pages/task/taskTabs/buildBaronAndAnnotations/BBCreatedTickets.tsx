import React from "react";
import { useQuery } from "@apollo/client";
import { Skeleton } from "antd";
import { SECOND } from "constants/index";
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
  setCreatedTicketsCount: React.Dispatch<React.SetStateAction<number>>;
  createdTicketsCount: number;
  buildBaronConfigured: boolean;
}

export const CreatedTickets: React.FC<CreatedTicketsProps> = ({
  taskId,
  execution,
  setCreatedTicketsCount,
  createdTicketsCount,
  buildBaronConfigured,
}) => {
  const dispatchToast = useToastContext();
  const { data, startPolling, stopPolling } = useQuery<
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

  // after a user creates a ticket, it takes a bit of time for that ticket
  // to be reflected in the created tickets query. Therefore, we start
  // polling one second after a ticket is filed by a user, and stop polling
  // when the number of created tickets is the same as the number of tickets
  // retrieved by the query.

  if (createdTicketsCount > length) {
    startPolling(1 * SECOND);
    return <Skeleton active title={false} paragraph={{ rows: 4 }} />;
  }
  setCreatedTicketsCount(length);
  stopPolling();

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
            setCreatedTicketsCount={setCreatedTicketsCount}
            createdTicketsCount={createdTicketsCount}
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
      <FileTicket taskId={taskId} execution={execution} />
    </TitleAndButtons>
  </>
);
