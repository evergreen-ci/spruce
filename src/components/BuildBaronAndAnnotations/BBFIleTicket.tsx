import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import { Popconfirm } from "antd";
import { useTaskAnalytics } from "analytics";
import { useBannerDispatchContext } from "context/banners";
import {
  BbCreateTicketMutation,
  BbCreateTicketMutationVariables,
} from "gql/generated/types";
import { FILE_JIRA_TICKET } from "gql/mutations";
import { ButtonWrapper } from "./BBComponents";

interface BBFileTicketProps {
  taskId: string;
  setCreatedTicketsCount: React.Dispatch<React.SetStateAction<number>>;
  createdTicketsCount: number;
}

export const BBFileTicket: React.FC<BBFileTicketProps> = ({
  taskId,
  setCreatedTicketsCount,
  createdTicketsCount,
}) => (
  <>
    <FileTicket
      taskId={taskId}
      setCreatedTicketsCount={setCreatedTicketsCount}
      createdTicketsCount={createdTicketsCount}
    />
  </>
);

interface FileTicketProps {
  taskId: string;
  setCreatedTicketsCount;
  createdTicketsCount: number;
}

export const FileTicket: React.FC<FileTicketProps> = ({
  taskId,
  setCreatedTicketsCount,
  createdTicketsCount,
}) => {
  const dispatchBanner = useBannerDispatchContext();
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
  const taskAnalytics = useTaskAnalytics();
  const onClickFile = () => {
    taskAnalytics.sendEvent({ name: "Build Baron File Ticket" });
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
      <ButtonWrapper>
        <Button
          data-cy="file-ticket-button"
          variant={Variant.Primary}
          size={Size.XSmall}
        >
          {buttonText}
        </Button>
      </ButtonWrapper>
    </Popconfirm>
  );
};
