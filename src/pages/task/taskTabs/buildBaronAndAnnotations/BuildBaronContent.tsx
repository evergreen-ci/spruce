import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { useToastContext } from "context/toast";
import {
  BuildBaron,
  Annotation,
  CustomCreatedIssuesQuery,
  CustomCreatedIssuesQueryVariables,
  CreatedTicketsQuery,
  CreatedTicketsQueryVariables,
} from "gql/generated/types";
import {
  GET_CREATED_TICKETS,
  GET_JIRA_CUSTOM_CREATED_ISSUES,
} from "gql/queries";
import AnnotationNote from "./AnnotationNote";
import { BBCreatedTickets, CustomCreatedTickets } from "./CreatedTicketsTable";
import { Issues, SuspectedIssues } from "./Issues";
import JiraIssueTable from "./JiraIssueTable";

interface BuildBaronCoreProps {
  bbData: BuildBaron;
  taskId: string;
  execution: number;
  loading: boolean;
  annotation: Annotation;
  userCanModify: boolean;
}

const BuildBaronContent: React.VFC<BuildBaronCoreProps> = ({
  annotation,
  bbData,
  execution,
  loading,
  taskId,
  userCanModify,
}) => {
  const [selectedRowKey, setSelectedRowKey] = useState("");
  const dispatchToast = useToastContext();

  const { data: customCreatedTickets } = useQuery<
    CustomCreatedIssuesQuery,
    CustomCreatedIssuesQueryVariables
  >(GET_JIRA_CUSTOM_CREATED_ISSUES, {
    onError: (err) => {
      dispatchToast.error(
        `There was an error loading the ticket information from Jira: ${err.message}`
      );
    },
    variables: { execution, taskId },
  });

  const { data: bbCreatedTickets } = useQuery<
    CreatedTicketsQuery,
    CreatedTicketsQueryVariables
  >(GET_CREATED_TICKETS, {
    onError(error) {
      dispatchToast.error(
        `There was an error getting tickets created for this task: ${error.message}`
      );
    },
    variables: { taskId },
  });

  const customTickets = customCreatedTickets?.task?.annotation?.createdIssues;
  const bbTickets = bbCreatedTickets?.bbGetCreatedTickets;
  const canCreateTickets = bbData?.bbTicketCreationDefined;

  return (
    <Wrapper data-cy="bb-content">
      {loading && <Skeleton active title={false} paragraph={{ rows: 4 }} />}
      {canCreateTickets ? (
        <CustomCreatedTickets
          taskId={taskId}
          execution={execution}
          tickets={customTickets}
        />
      ) : (
        <BBCreatedTickets
          taskId={taskId}
          execution={execution}
          buildBaronConfigured={bbData?.buildBaronConfigured}
          tickets={bbTickets}
        />
      )}

      <AnnotationNote
        note={annotation?.note}
        taskId={taskId}
        execution={execution}
        userCanModify={userCanModify}
      />
      <Issues
        taskId={taskId}
        execution={execution}
        userCanModify={userCanModify}
        selectedRowKey={selectedRowKey}
        setSelectedRowKey={setSelectedRowKey}
        annotation={annotation}
      />
      <SuspectedIssues
        taskId={taskId}
        execution={execution}
        userCanModify={userCanModify}
        selectedRowKey={selectedRowKey}
        setSelectedRowKey={setSelectedRowKey}
        annotation={annotation}
      />
      {bbData?.searchReturnInfo?.issues.length > 0 && (
        <JiraIssueTable bbData={bbData} />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 80%;
`;

export default BuildBaronContent;
