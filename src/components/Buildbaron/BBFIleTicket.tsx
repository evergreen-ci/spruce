import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import Button, { Variant } from "@leafygreen-ui/button";
import { Popconfirm } from "antd";
import { DispatchBanner } from "context/banners";
import {
  BbCreateTicketMutation,
  BbCreateTicketMutationVariables,
} from "gql/generated/types";
import { FILE_JIRA_TICKET } from "gql/mutations/file-jira-ticket";
import { BBTitle } from "./BBComponents";

interface BBFileTicketProps {
  taskId: string;
  dispatchBanner: DispatchBanner;
  setCreatedTicketsCount: React.Dispatch<React.SetStateAction<number>>;
  createdTicketsCount: number;
}

export const BBFileTicket: React.FC<BBFileTicketProps> = ({
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
      cancelButtonProps={{ disabled: loadingFileJiraTicket }}
    >
      <Button
        data-cy="file-ticket-button"
        variant={Variant.Primary}
        size="xsmall"
      >
        {buttonText}
      </Button>
    </Popconfirm>
  );
};
