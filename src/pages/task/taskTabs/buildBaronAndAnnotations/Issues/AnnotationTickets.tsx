import { useState } from "react";
import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { useAnnotationAnalytics } from "analytics";
import { PlusButton } from "components/Buttons";
import { size } from "constants/tokens";
import { IssueLink } from "gql/generated/types";
import { AddIssueModal } from "../AddIssueModal";
import AnnotationTicketsList from "../AnnotationTicketsList";
import { TicketsTitle } from "../BBComponents";

interface AnnotationTicketsProps {
  tickets: IssueLink[];
  taskId: string;
  execution: number;
  isIssue: boolean;
  userCanModify: boolean;
  selectedRowKey: string;
  setSelectedRowKey: (selectedRowKey: string) => void;
  loading: boolean;
}

const AnnotationTickets: React.FC<AnnotationTicketsProps> = ({
  execution,
  isIssue,
  loading,
  selectedRowKey,
  setSelectedRowKey,
  taskId,
  tickets,
  userCanModify,
}) => {
  const annotationAnalytics = useAnnotationAnalytics();
  const title = isIssue ? "Issues" : "Suspected Issues";
  const buttonText = isIssue ? "Add Issue" : "Add Suspected Issue";
  const [isAddAnnotationModalVisible, setIsAddAnnotationModalVisible] =
    useState<boolean>(false);

  const handleAdd = () => {
    setIsAddAnnotationModalVisible(true);
    const analyticsType = isIssue
      ? "Click Add Annotation Issue Button"
      : "Click Add Annotation Suspected Issue Button";
    annotationAnalytics.sendEvent({ name: analyticsType });
  };
  return (
    <>
      <TicketsTitle>{title}</TicketsTitle>
      <Tooltip
        trigger={
          <StyledButton
            onClick={handleAdd}
            data-cy={
              isIssue ? "add-issue-button" : "add-suspected-issue-button"
            }
            disabled={!userCanModify}
          >
            {buttonText}
          </StyledButton>
        }
        enabled={!userCanModify}
      >
        You are not authorized to edit failure details
      </Tooltip>
      {tickets.length > 0 && (
        <AnnotationTicketsList
          jiraIssues={tickets}
          taskId={taskId}
          execution={execution}
          isIssue={isIssue}
          userCanModify={userCanModify}
          selectedRowKey={selectedRowKey}
          setSelectedRowKey={setSelectedRowKey}
          loading={loading}
        />
      )}
      <AddIssueModal
        data-cy="addIssueModal"
        visible={isAddAnnotationModalVisible}
        closeModal={() => setIsAddAnnotationModalVisible(false)}
        setSelectedRowKey={setSelectedRowKey}
        taskId={taskId}
        execution={execution}
        isIssue={isIssue}
      />
    </>
  );
};

const StyledButton = styled(PlusButton)`
  margin: ${size.xs} 0;
`;

export default AnnotationTickets;
