import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Disclaimer, Subtitle } from "@leafygreen-ui/typography";
import { useAnnotationAnalytics } from "analytics";
import { StyledLink } from "components/styles";
import { getJiraTicketUrl } from "constants/externalResources";
import { size } from "constants/tokens";
import {
  GetSpruceConfigQuery,
  JiraTicket,
  Source,
  TicketFields,
} from "gql/generated/types";
import { GET_SPRUCE_CONFIG } from "gql/queries";
import { string } from "utils";

const { getDateCopy } = string;
interface TitleProps {
  margin?: boolean;
}

interface JiraTicketRowProps {
  jiraKey: string;
  fields: TicketFields;
}
export const JiraTicketRow: React.FC<JiraTicketRowProps> = ({
  jiraKey,
  fields,
}) => {
  const annotationAnalytics = useAnnotationAnalytics();

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
          annotationAnalytics.sendEvent({ name: "Click Jira Summary Link" })
        }
      >
        {jiraKey}: {summary} {"   "}
      </JiraSummaryLink>

      <StyledBadge data-cy={`${jiraKey}-badge`} variant="lightgray">
        {status.name}
      </StyledBadge>

      <BottomMetaDataWrapper data-cy={`${jiraKey}-metadata`}>
        <Disclaimer>
          Created: {getDateCopy(created, { dateOnly: true })}{" "}
        </Disclaimer>
        <Disclaimer>
          Updated: {getDateCopy(updated, { dateOnly: true })}{" "}
        </Disclaimer>
        <Disclaimer>
          {assigneeDisplayName
            ? `Assignee: ${assigneeDisplayName}`
            : "Unassigned"}{" "}
        </Disclaimer>
      </BottomMetaDataWrapper>
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
  const annotationAnalytics = useAnnotationAnalytics();
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
      <JiraSummaryLink
        href={url}
        data-cy={issueKey}
        onClick={() =>
          annotationAnalytics.sendEvent({
            name: "Click Annotation Ticket Link",
          })
        }
      >
        {issueKey}
        {summary && `: ${summary}`}
      </JiraSummaryLink>

      {jiraTicket && (
        <StyledBadge data-cy={`${issueKey}-badge`} variant="lightgray">
          {status.name}
        </StyledBadge>
      )}

      <BottomMetaDataWrapper data-cy={`${issueKey}-metadata`}>
        {created && (
          <Disclaimer>
            Created: {getDateCopy(created, { dateOnly: true })}
          </Disclaimer>
        )}
        {updated && (
          <Disclaimer>
            Updated: {getDateCopy(updated, { dateOnly: true })}
          </Disclaimer>
        )}
        {fields && !assigneeDisplayName && <Disclaimer>Unassigned</Disclaimer>}{" "}
        {assigneeDisplayName && (
          <Disclaimer>Assignee: {assigneeDisplayName}</Disclaimer>
        )}
        {assignedTeam && <Disclaimer>Assigned Team: {assignedTeam}</Disclaimer>}{" "}
      </BottomMetaDataWrapper>
    </div>
  );
};

// @ts-expect-error
export const TicketsTitle = styled(Subtitle)<TitleProps>`
  margin-bottom: ${(props) => (props.margin ? size.s : size.xxs)};
  margin-top: ${(props) => (props.margin ? size.m : "35px")};
  line-height: ${size.m};
  font-weight: bold;
`;

const JiraSummaryLink = styled(StyledLink)`
  font-weight: bold;
  margin-right: ${size.s};
`;

const StyledBadge = styled(Badge)`
  justify-content: center;
  padding: 0px ${size.s} 0px;
`;

export const BottomMetaDataWrapper = styled.div`
  margin-top: ${size.xs};
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 10px;
  grid-template-rows: 1fr;
  grid-row-gap: 0px;
  width: 80%;
`;

export const TopMetaDataWrapper = styled.div`
  margin-bottom: ${size.xs};
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 10px;
  grid-template-rows: 1fr;
  grid-row-gap: 0px;
  width: 80%;
`;

export const TitleAndButtons = styled.div`
  margin-left: ${size.s};
`;

export const ButtonWrapper = styled.div`
  margin-right: ${size.xs};
  padding-top: ${size.s};
`;
