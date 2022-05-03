import { useState } from "react";
import { useMutation } from "@apollo/client";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import { Popconfirm } from "antd";
import { useAnnotationAnalytics } from "analytics";
import { useToastContext } from "context/toast";
import {
  BbCreateTicketMutation,
  BbCreateTicketMutationVariables,
} from "gql/generated/types";

import { FILE_JIRA_TICKET } from "gql/mutations";

import { ButtonWrapper } from "./BBComponents";

interface FileTicketProps {
  taskId: string;
  execution: number;
}

const FileTicketButton: React.VFC<FileTicketProps> = ({
  taskId,
  execution,
}) => {
  const dispatchToast = useToastContext();

  const [fileJiraTicket, { loading: loadingFileJiraTicket }] = useMutation<
    BbCreateTicketMutation,
    BbCreateTicketMutationVariables
  >(FILE_JIRA_TICKET, {
    onCompleted: () => {
      setButtonText("FILE ANOTHER TICKET");
      dispatchToast.success(`Ticket successfully created for this task.`);
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

export default FileTicketButton;
