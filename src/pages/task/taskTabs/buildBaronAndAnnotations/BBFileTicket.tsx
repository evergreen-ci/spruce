import { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import { Popconfirm } from "antd";
import { useAnnotationAnalytics } from "analytics";
import { useToastContext } from "context/toast";
import {
  GetCreatedTicketsQuery,
  GetCreatedTicketsQueryVariables,
  BbCreateTicketMutation,
  BbCreateTicketMutationVariables,
  JiraTicket,
  IssueLink,
} from "gql/generated/types";

import { FILE_JIRA_TICKET } from "gql/mutations";
import { GET_CREATED_TICKETS } from "gql/queries";
import { usePolling } from "hooks";
import { ButtonWrapper } from "./BBComponents";

interface FileTicketProps {
  taskId: string;
  execution: number;
  tickets: JiraTicket[] | IssueLink[];
}

export const FileTicket: React.FC<FileTicketProps> = ({
  taskId,
  execution,
  tickets,
}) => {
  const dispatchToast = useToastContext();

  const [getCreatedTicket, { startPolling, stopPolling }] = useLazyQuery<
    GetCreatedTicketsQuery,
    GetCreatedTicketsQueryVariables
  >(GET_CREATED_TICKETS, {
    variables: { taskId },
    pollInterval: 3000,
    onError(error) {
      dispatchToast.error(
        `There was an error getting tickets created for this task: ${error.message}`
      );
    },
  });
  usePolling(startPolling, stopPolling);

  // Stop polling when we get updated created ticket data
  useEffect(() => {
    if (stopPolling) {
      stopPolling();
    }
  }, [tickets]); // eslint-disable-line react-hooks/exhaustive-deps

  const [fileJiraTicket, { loading: loadingFileJiraTicket }] = useMutation<
    BbCreateTicketMutation,
    BbCreateTicketMutationVariables
  >(FILE_JIRA_TICKET, {
    onCompleted: () => {
      setButtonText("FILE ANOTHER TICKET");
      dispatchToast.success(`Ticket successfully created for this task.`);
      getCreatedTicket();
    },
    onError(error) {
      dispatchToast.error(
        `There was an error filing the ticket: ${error.message}`
      );
    },
  });

  const [buttonText, setButtonText] = useState<string>("FILE TICKET");
  const annotationAnalytics = useAnnotationAnalytics();
  const onClickFile = () => {
    annotationAnalytics.sendEvent({ name: "Build Baron File Ticket" });
    fileJiraTicket({ variables: { taskId, execution } });
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
