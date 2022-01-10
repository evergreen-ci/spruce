import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Skeleton } from "antd";
import { StyledLink } from "components/styles";
import { getJiraSearchUrl } from "constants/externalResources";
import { useToastContext } from "context/toast";
import {
  GetSpruceConfigQuery,
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
  GET_SPRUCE_CONFIG,
} from "gql/queries";
import { AnnotationNote } from "./AnnotationNote";
import { Issues, SuspectedIssues } from "./AnnotationTickets";
import { CustomCreatedTicketsTable } from "./AnnotationTicketsTable";
import { TicketsTitle, TitleAndButtons } from "./BBComponents";
import { CreatedTickets, CustomCreatedTickets } from "./BBCreatedTickets";
import { BuildBaronTable } from "./BuildBaronTable";

interface BuildBaronCoreProps {
  bbData: BuildBaron;
  taskId: string;
  execution: number;
  loading: boolean;
  annotation: Annotation;
  userCanModify: boolean;
}

export const BuildBaronContent: React.FC<BuildBaronCoreProps> = ({
  bbData,
  taskId,
  execution,
  loading,
  annotation,
  userCanModify,
}) => {
  const [selectedRowKey, setSelectedRowKey] = useState("");

  const { data } = useQuery<GetSpruceConfigQuery>(GET_SPRUCE_CONFIG);
  const spruceConfig = data?.spruceConfig;
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

  const { data: BBCreatedTickets } = useQuery<
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
  const bbtickets = BBCreatedTickets?.bbGetCreatedTickets;

  return (
    <div data-cy="bb-content">
      {loading && <Skeleton active title={false} paragraph={{ rows: 4 }} />}
      {bbData?.bbTicketCreationDefined ? (
        <CustomCreatedTickets
          taskId={taskId}
          execution={execution}
          tickets={customTickets}
        />
      ) : (
        <CreatedTickets
          taskId={taskId}
          execution={execution}
          buildBaronConfigured={bbData?.buildBaronConfigured}
          tickets={bbtickets}
        />
      )}
      {bbtickets?.length > 0 && <BuildBaronTable jiraIssues={bbtickets} />}

      {customTickets?.length > 0 && (
        <CustomCreatedTicketsTable createdIssues={customTickets} />
      )}
      <AnnotationNote
        note={annotation?.note}
        taskId={taskId}
        execution={execution}
        userCanModify={userCanModify}
      />
      <Issues
        isIssue
        taskId={taskId}
        execution={execution}
        userCanModify={userCanModify}
        selectedRowKey={selectedRowKey}
        setSelectedRowKey={setSelectedRowKey}
      />
      <SuspectedIssues
        isIssue={false}
        taskId={taskId}
        execution={execution}
        userCanModify={userCanModify}
        selectedRowKey={selectedRowKey}
        setSelectedRowKey={setSelectedRowKey}
      />
      {bbData?.searchReturnInfo?.issues.length > 0 && (
        <>
          <TitleAndButtons>
            {/* @ts-expect-error */}
            <TicketsTitle>
              Related tickets from Jira
              <StyledLink data-cy="jira-search-link" href={jiraSearchLink}>
                {"  "}(Jira Search)
              </StyledLink>
            </TicketsTitle>
          </TitleAndButtons>
          {/* build baron related jira tickets */}
          <BuildBaronTable jiraIssues={bbData?.searchReturnInfo?.issues} />
        </>
      )}
    </div>
  );
};
