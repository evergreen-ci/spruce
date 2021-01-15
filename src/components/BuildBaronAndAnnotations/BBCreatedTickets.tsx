import React from "react";
import { useQuery } from "@apollo/client";
import { Skeleton } from "antd";
import { SECOND } from "constants/index";
import { useBannerDispatchContext } from "context/banners";
import {
  GetCreatedTicketsQuery,
  GetCreatedTicketsQueryVariables,
} from "gql/generated/types";
import { GET_CREATED_TICKETS } from "gql/queries";
import { TicketsTitle, TitleAndButtons } from "./BBComponents";
import { BBFileTicket } from "./BBFIleTicket";
import { BuildBaronTable } from "./BuildBaronTable";

interface Props {
  taskId: string;
  setCreatedTicketsCount: React.Dispatch<React.SetStateAction<number>>;
  createdTicketsCount: number;
  buildBaronConfigured: boolean;
}

export const CreatedTickets: React.FC<Props> = ({
  taskId,
  setCreatedTicketsCount,
  createdTicketsCount,
  buildBaronConfigured,
}) => {
  const dispatchBanner = useBannerDispatchContext();
  const { data, startPolling, stopPolling } = useQuery<
    GetCreatedTicketsQuery,
    GetCreatedTicketsQueryVariables
  >(GET_CREATED_TICKETS, {
    variables: { taskId },
    onError(error) {
      dispatchBanner.errorBanner(
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
            <TicketsTitle>Tickets Created From This Task </TicketsTitle>
          </TitleAndButtons>
          <BuildBaronTable jiraIssues={data?.bbGetCreatedTickets} />{" "}
        </>
      )}
      {buildBaronConfigured && (
        <TitleAndButtons>
          {length === 0 && (
            <TicketsTitle>Create a New Ticket in Jira</TicketsTitle>
          )}
          <BBFileTicket
            taskId={taskId}
            setCreatedTicketsCount={setCreatedTicketsCount}
            createdTicketsCount={createdTicketsCount}
          />
        </TitleAndButtons>
      )}
    </>
  );
};
