import { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import { useAnnotationAnalytics } from "analytics";
import Popconfirm from "components/Popconfirm";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  BuildBaronCreateTicketMutation,
  BuildBaronCreateTicketMutationVariables,
} from "gql/generated/types";
import { FILE_JIRA_TICKET } from "gql/mutations";
import { ButtonWrapper } from "./BBComponents";

interface FileTicketProps {
  taskId: string;
  execution: number;
}

const FileTicketButton: React.FC<FileTicketProps> = ({ execution, taskId }) => {
  const dispatchToast = useToastContext();

  const [fileJiraTicket, { loading: loadingFileJiraTicket }] = useMutation<
    BuildBaronCreateTicketMutation,
    BuildBaronCreateTicketMutationVariables
  >(FILE_JIRA_TICKET, {
    onCompleted: () => {
      setButtonText("File another ticket");
      dispatchToast.success(`Successfully requested ticket`);
    },
    onError(error) {
      dispatchToast.error(
        `There was an error filing the ticket: ${error.message}`,
      );
    },
    refetchQueries: ["CreatedTickets", "CustomCreatedIssues"],
  });

  const [buttonText, setButtonText] = useState<string>("File ticket");
  const annotationAnalytics = useAnnotationAnalytics();
  const onClickFile = () => {
    annotationAnalytics.sendEvent({ name: "Build Baron File Ticket" });
    fileJiraTicket({ variables: { taskId, execution } });
  };

  return (
    <Container>
      <Popconfirm
        align="right"
        confirmDisabled={loadingFileJiraTicket}
        data-cy="file-ticket-popconfirm"
        onConfirm={onClickFile}
        trigger={
          <ButtonWrapper>
            <Button
              data-cy="file-ticket-button"
              variant={Variant.Primary}
              size={Size.XSmall}
            >
              {buttonText}
            </Button>
          </ButtonWrapper>
        }
      >
        Do you want to create a failure ticket for this task?
      </Popconfirm>
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: ${size.m};
`;

export default FileTicketButton;
