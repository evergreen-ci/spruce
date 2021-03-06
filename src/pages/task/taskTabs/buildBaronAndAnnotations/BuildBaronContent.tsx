import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Skeleton } from "antd";
import { StyledLink } from "components/styles";
import { getJiraSearchUrl } from "constants/externalResources";
import {
  GetSpruceConfigQuery,
  BuildBaron,
  Annotation,
} from "gql/generated/types";
import { GET_SPRUCE_CONFIG } from "gql/queries";
import { AnnotationNote } from "./AnnotationNote";
import { Issues, SuspectedIssues } from "./AnnotationTickets";
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

  return (
    <div data-cy="bb-content">
      {loading && <Skeleton active title={false} paragraph={{ rows: 4 }} />}
      {annotation?.webhookConfigured ? (
        <CustomCreatedTickets taskId={taskId} execution={execution} />
      ) : (
        <CreatedTickets
          taskId={taskId}
          execution={execution}
          buildBaronConfigured={bbData?.buildBaronConfigured}
        />
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
