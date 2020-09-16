import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { Popconfirm } from "antd";
import {
  BbCreateTicketMutation,
  BbCreateTicketMutationVariables,
  GetCreatedTicketsQuery,
  GetCreatedTicketsQueryVariables,
} from "gql/generated/types";
import { FILE_JIRA_TICKET } from "gql/mutations/file-jira-ticket";
import { GET_CREATED_TICKETS } from "gql/queries/get-created-tickets";
import { BBTitle, TitleAndButtons } from "./BBComponents";
import { BuildBaronTable } from "./BuildBaronTable";

export const BBFileTicket: React.FC<{
  taskId: string;
  dispatchBanner;
  setCreatedTicketsCount;
  createdTicketsCount;
}> = ({
  taskId,
  dispatchBanner,
  setCreatedTicketsCount,
  createdTicketsCount,
}) => (
  <>
    <BBTitle margin>Create a new ticket in Jira </BBTitle>
    <FileTicket
      taskId={taskId}
      dispatchBanner={dispatchBanner}
      setCreatedTicketsCount={setCreatedTicketsCount}
      createdTicketsCount={createdTicketsCount}
    />
  </>
);

interface FileTicketProps {
  taskId: string;
  dispatchBanner;
  setCreatedTicketsCount;
  createdTicketsCount: number;
}

export const FileTicket: React.FC<FileTicketProps> = ({
  taskId,
  dispatchBanner,
  setCreatedTicketsCount,
  createdTicketsCount,
}) => {
  const [fileJiraTicket, { loading: loadingFileJiraTicket }] = useMutation<
    BbCreateTicketMutation,
    BbCreateTicketMutationVariables
  >(FILE_JIRA_TICKET, {
    onCompleted: () => {
      setButtonText("FILE ANOTHER TICKET");
      dispatchBanner.successBanner(
        `Ticket successfully created for this task.`
      );
      setCreatedTicketsCount(createdTicketsCount + 1);
    },
    onError(error) {
      dispatchBanner.errorBanner(
        `There was an error filing the ticket: ${error.message}`
      );
    },
  });

  const [buttonText, setButtonText] = useState<string>("FILE TICKET");
  const onClickFile = () => {
    // todo: add analytics
    fileJiraTicket({ variables: { taskId } });
  };

  return (
    <Popconfirm
      title="Do you want to create a failure ticket for this task?"
      onConfirm={onClickFile}
      icon={null}
      placement="right"
      okText="File Ticket"
      okButtonProps={{ loading: loadingFileJiraTicket }}
      // cancelText="Cancel"
      cancelButtonProps={{ disabled: loadingFileJiraTicket }}
    >
      <FileButton
        dataCy="file-ticket-button"
        variant={Variant.Primary}
        size="small"
      >
        {buttonText}
      </FileButton>
    </Popconfirm>
  );
};

interface CreatedTicketsProps {
  taskId: string;
  dispatchBanner;
  setCreatedTicketsCount;
  createdTicketsCount;
}

export const CreatedTickets: React.FC<CreatedTicketsProps> = ({
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

  if (createdTicketsCount > data?.bbGetCreatedTickets?.length) {
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

const FileButton = styled(Button)`
  justify-content: center;
  // width: 97px;
  height: 22px;
  margin-bottom: 15px;
  font-size: 11px;
`;
