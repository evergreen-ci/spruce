import React from "react";
import { useQuery } from "@apollo/client";
import { DispatchBanner } from "context/banners";
import {
  GetCreatedTicketsQuery,
  GetCreatedTicketsQueryVariables,
} from "gql/generated/types";
import { GET_CREATED_TICKETS } from "gql/queries/get-created-tickets";
import { BBTitle, TitleAndButtons } from "./BBComponents";
import { BuildBaronTable } from "./BuildBaronTable";

interface Props {
  taskId: string;
  dispatchBanner: DispatchBanner;
  setCreatedTicketsCount: React.Dispatch<React.SetStateAction<number>>;
  createdTicketsCount: number;
}

export const CreatedTickets: React.FC<Props> = ({
  taskId,
  dispatchBanner,
  setCreatedTicketsCount,
  createdTicketsCount,
}) => {
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
  const length = data?.bbGetCreatedTickets?.length;

  if (createdTicketsCount > length) {
    startPolling(1 * 1000);
  } else {
    setCreatedTicketsCount(length);
    stopPolling();
  }

  return (
    <>
      {length > 0 && (
        <>
          <TitleAndButtons>
            <BBTitle>Tickets Created From This Task </BBTitle>
          </TitleAndButtons>
          <BuildBaronTable jiraIssues={data?.bbGetCreatedTickets} />{" "}
        </>
      )}
    </>
  );
};
