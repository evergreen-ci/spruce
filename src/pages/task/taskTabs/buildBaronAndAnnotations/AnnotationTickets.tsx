import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Tooltip } from "antd";
import { useAnnotationAnalytics } from "analytics";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { PlusButton } from "components/Spawn";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  GetIssuesQuery,
  GetIssuesQueryVariables,
  GetSuspectedIssuesQuery,
  GetSuspectedIssuesQueryVariables,
  IssueLink,
  Annotation,
} from "gql/generated/types";
import { GET_JIRA_ISSUES, GET_JIRA_SUSPECTED_ISSUES } from "gql/queries";
import { AddIssueModal } from "./AddIssueModal";
import { AnnotationTicketsTable } from "./AnnotationTicketsTable";
import { TicketsTitle, TitleAndButtons } from "./BBComponents";

interface AnnotationTicketsProps {
  tickets: IssueLink[];
  taskId: string;
  execution: number;
  isIssue: boolean;
  userCanModify: boolean;
  selectedRowKey: string;
  setSelectedRowKey: React.Dispatch<React.SetStateAction<string>>;
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
        <ConditionalWrapper
          condition={!userCanModify}
          wrapper={(children) => (
            <Tooltip title="You are not authorized to edit failure details">
              <span>{children}</span>
            </Tooltip>
          )}
        >
          <StyledButton
            onClick={onClickAdd}
            data-cy={
              isIssue ? "add-issue-button" : "add-suspected-issue-button"
            }
            disabled={!userCanModify}
          >
            {buttonText}
          </StyledButton>
        </ConditionalWrapper>
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

interface IssuesProps {
  taskId: string;
  execution: number;
  userCanModify: boolean;
  selectedRowKey: string;
  setSelectedRowKey: React.Dispatch<React.SetStateAction<string>>;
  annotation: Annotation;
}

export const Issues: React.VFC<IssuesProps> = ({
  taskId,
  execution,
  userCanModify,
  selectedRowKey,
  setSelectedRowKey,
  annotation,
}) => {
  const dispatchToast = useToastContext();
  // Query Jira ticket data
  const { data, loading } = useQuery<GetIssuesQuery, GetIssuesQueryVariables>(
    GET_JIRA_ISSUES,
    {
      variables: { taskId, execution },
      onError: (err) => {
        dispatchToast.error(
          `There was an error loading the ticket information from Jira: ${err.message}`
        );
      },
    }
  );
  return (
    <AnnotationTickets
      tickets={data?.task?.annotation?.issues || annotation?.issues || []}
      taskId={taskId}
      execution={execution}
      userCanModify={userCanModify}
      selectedRowKey={selectedRowKey}
      setSelectedRowKey={setSelectedRowKey}
      loading={loading}
      isIssue
    />
  );
};

interface SuspectedIssuesProps {
  taskId: string;
  execution: number;
  userCanModify: boolean;
  selectedRowKey: string;
  setSelectedRowKey: React.Dispatch<React.SetStateAction<string>>;
  annotation: Annotation;
}

export const SuspectedIssues: React.VFC<SuspectedIssuesProps> = ({
  taskId,
  execution,
  userCanModify,
  selectedRowKey,
  setSelectedRowKey,
  annotation,
}) => {
  const dispatchToast = useToastContext();
  // Query Jira ticket data
  const { data, loading } = useQuery<
    GetSuspectedIssuesQuery,
    GetSuspectedIssuesQueryVariables
  >(GET_JIRA_SUSPECTED_ISSUES, {
    variables: { taskId, execution },
    onError: (err) => {
      dispatchToast.error(
        `There was an error loading the ticket information from Jira: ${err.message}`
      );
    },
  });

  const suspectedIssues = data?.task?.annotation?.suspectedIssues;
  return (
    <AnnotationTickets
      tickets={suspectedIssues || annotation?.suspectedIssues || []}
      taskId={taskId}
      execution={execution}
      userCanModify={userCanModify}
      selectedRowKey={selectedRowKey}
      setSelectedRowKey={setSelectedRowKey}
      loading={loading}
      isIssue={false}
    />
  );
};

const StyledButton = styled(PlusButton)`
  margin: ${size.xs} 0;
`;
