import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Disclaimer, Subtitle } from "@leafygreen-ui/typography";
import { useTaskAnalytics } from "analytics";
import { StyledLink } from "components/styles";
import { getJiraTicketUrl } from "constants/externalResources";
import {
  GetSpruceConfigQuery,
  JiraTicket,
  Source,
  TicketFields,
} from "gql/generated/types";
import { GET_SPRUCE_CONFIG } from "gql/queries";
import { getDateCopy } from "utils/string";

interface TitleProps {
  margin?: boolean;
}

export const TicketsTitle = styled(Subtitle)<TitleProps>`
  margin-bottom: ${(props) => (props.margin ? "15px" : "5px")};
  margin-top: ${(props) => (props.margin ? "25px" : "35px")};
  line-height: 24px;
  font-weight: bold;
`;

interface JiraTicketRowProps {
  jiraKey: string;
  fields: TicketFields;
}
export const JiraTicketRow: React.FC<JiraTicketRowProps> = ({
  jiraKey,
  fields,
}) => {
  const taskAnalytics = useTaskAnalytics();

  const { data } = useQuery<GetSpruceConfigQuery>(GET_SPRUCE_CONFIG);
  const spruceConfig = data?.spruceConfig;
  const jiraHost = spruceConfig?.jira?.host;
  const url = getJiraTicketUrl(jiraHost, jiraKey);
  const { created, assigneeDisplayName, updated, status, summary } =
    fields ?? {};
  return (
    <div>
      <JiraSummaryLink
        href={url}
        data-cy={jiraKey}
        onClick={() =>
          taskAnalytics.sendEvent({ name: "Click Jira Summary Link" })
        }
      >
        {jiraKey}: {summary} {"   "}
      </JiraSummaryLink>

      <StyledBadge data-cy={`${jiraKey}-badge`} variant="lightgray">
        {status.name}
      </StyledBadge>

      <MetaDataWrapper data-cy={`${jiraKey}-metadata`}>
        <Disclaimer>Created: {getDateCopy(created, null, true)} </Disclaimer>
        <Disclaimer>Updated: {getDateCopy(updated, null, true)} </Disclaimer>
        <Disclaimer>
          {assigneeDisplayName
            ? `Assignee: ${assigneeDisplayName}`
            : "Unassigned"}{" "}
        </Disclaimer>
      </MetaDataWrapper>
    </div>
  );
};
interface AnnotationTicketRowProps {
  issueKey: string;
  url: string;
  source: Source;
  jiraTicket: JiraTicket;
}

export const AnnotationTicketRow: React.FC<AnnotationTicketRowProps> = ({
  issueKey,
  url,
  jiraTicket,
}) => {
  const fields = jiraTicket?.fields;
  const {
    created,
    assigneeDisplayName,
    assignedTeam,
    updated,
    summary,
    status,
  } = jiraTicket?.fields ?? {};

  return (
    <div data-cy="annotation-ticket-row">
      <JiraSummaryLink href={url} data-cy={issueKey}>
        {issueKey}
        {summary && `: ${summary}`}
      </JiraSummaryLink>

      {jiraTicket && (
        <StyledBadge data-cy={`${issueKey}-badge`} variant="lightgray">
          {status.name}
        </StyledBadge>
      )}

      <MetaDataWrapper data-cy={`${issueKey}-metadata`}>
        {created && (
          <Disclaimer>Created: {getDateCopy(created, null, true)}</Disclaimer>
        )}
        {updated && (
          <Disclaimer>Updated: {getDateCopy(updated, null, true)}</Disclaimer>
        )}
        {fields && !assigneeDisplayName && <Disclaimer>Unassigned</Disclaimer>}{" "}
        {assigneeDisplayName && (
          <Disclaimer>Assignee: {assigneeDisplayName}</Disclaimer>
        )}
        {assignedTeam && <Disclaimer>Assigned Team: {assignedTeam}</Disclaimer>}{" "}
      </MetaDataWrapper>
    </div>
  );
};

const JiraSummaryLink = styled(StyledLink)`
  font-weight: bold;
  margin-right: 15px;
`;

const StyledBadge = styled(Badge)`
  justify-content: center;
  padding: 0px 15px 0px;
`;

export const MetaDataWrapper = styled.div`
  margin-top: 7px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  gap: 10px;
  grid-template-rows: 1fr;
  grid-row-gap: 0px;
  width: 60%;
`;

export const TitleAndButtons = styled.div`
  margin-left: 15px;
`;

export const ButtonWrapper = styled.div`
  margin-right: 8px;
  padding-top: 5px;
`;
