import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { StyledLink } from "components/styles";
import { getJiraSearchUrl } from "constants/externalResources";
import { useToastContext } from "context/toast";
import {
  BuildBaron,
  Annotation,
  GetCustomCreatedIssuesQuery,
  GetCustomCreatedIssuesQueryVariables,
  GetCreatedTicketsQuery,
  GetCreatedTicketsQueryVariables,
} from "gql/generated/types";
import {
  GET_CREATED_TICKETS,
  GET_JIRA_CUSTOM_CREATED_ISSUES,
} from "gql/queries";
import { useSpruceConfig } from "hooks";
import AnnotationNote from "./AnnotationNote";
import { TicketsTitle, NonTableWrapper } from "./BBComponents";
import {
  BBCreatedTickets,
  BuildBaronTable,
  CustomCreatedTickets,
} from "./CreatedTicketsTable";

import { Issues, SuspectedIssues } from "./Issues";

interface BuildBaronCoreProps {
  bbData: BuildBaron;
  taskId: string;
  execution: number;
  loading: boolean;
  annotation: Annotation;
  userCanModify: boolean;
}

const BuildBaronContent: React.VFC<BuildBaronCoreProps> = ({
  bbData,
  taskId,
  execution,
  loading,
  annotation,
  userCanModify,
}) => {
  const [selectedRowKey, setSelectedRowKey] = useState("");

  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;

  const jiraSearchString = bbData?.searchReturnInfo?.search;
  const jqlEscaped = encodeURIComponent(jiraSearchString);
  const jiraSearchLink = getJiraSearchUrl(jiraHost, jqlEscaped);

  const dispatchToast = useToastContext();

  const { data: customCreatedTickets } = useQuery<
    GetCustomCreatedIssuesQuery,
    GetCustomCreatedIssuesQueryVariables
  >(GET_JIRA_CUSTOM_CREATED_ISSUES, {
    variables: { taskId, execution },
    onError: (err) => {
      dispatchToast.error(
        `There was an error loading the ticket information from Jira: ${err.message}`
      );
    },
  });

  const { data: bbCreatedTickets } = useQuery<
    GetCreatedTicketsQuery,
    GetCreatedTicketsQueryVariables
  >(GET_CREATED_TICKETS, {
    variables: { taskId },
    onError(error) {
      dispatchToast.error(
        `There was an error getting tickets created for this task: ${error.message}`
      );
    },
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
        <>
          <NonTableWrapper>
            {/* @ts-expect-error */}
            <TicketsTitle>
              Related tickets from Jira
              <StyledLink data-cy="jira-search-link" href={jiraSearchLink}>
                {"  "}(Jira Search)
              </StyledLink>
            </TicketsTitle>
          </NonTableWrapper>
          {/* build baron related jira tickets */}
          <BuildBaronTable jiraIssues={bbData?.searchReturnInfo?.issues} />
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 80%;
`;

export default BuildBaronContent;
