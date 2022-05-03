import { useState } from "react";
import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { useAnnotationAnalytics } from "analytics";
import { PlusButton } from "components/Spawn";
import { size } from "constants/tokens";
import { IssueLink } from "gql/generated/types";
import { AddIssueModal } from "../AddIssueModal";
import { AnnotationTicketsTable } from "../AnnotationTicketsTable";
import { TicketsTitle, TitleAndButtons } from "../BBComponents";

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

const AnnotationTickets: React.VFC<AnnotationTicketsProps> = ({
  tickets,
  taskId,
  execution,
  isIssue,
  userCanModify,
  selectedRowKey,
  setSelectedRowKey,
  loading,
}) => {
  const annotationAnalytics = useAnnotationAnalytics();
  const title = isIssue ? "Issues" : "Suspected Issues";
  const buttonText = isIssue ? "Add Issue" : "Add Suspected Issue";
  const [
    isAddAnnotationModalVisible,
    setIsAddAnnotationModalVisible,
  ] = useState<boolean>(false);

  const onClickAdd = () => {
    setIsAddAnnotationModalVisible(true);
    const analyticsType = isIssue
      ? "Click Add Annotation Issue Button"
      : "Click Add Annotation Suspected Issue Button";
    annotationAnalytics.sendEvent({ name: analyticsType });
  };
  return (
    <>
      <TitleAndButtons>
        {/* @ts-expect-error */}
        <TicketsTitle>{title} </TicketsTitle>

        <Tooltip
          trigger={
            <StyledButton // @ts-expect-error
              onClick={onClickAdd}
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
      </TitleAndButtons>
      {tickets.length > 0 && (
        <AnnotationTicketsTable
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
        dataCy="addIssueModal"
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

// @ts-expect-error
const StyledButton = styled(PlusButton)`
  margin: ${size.xs} 0;
`;

export default AnnotationTickets;
