import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Disclaimer } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { useAnnotationAnalytics } from "analytics";
import { StyledLink } from "components/styles";
import { size } from "constants/tokens";
import { JiraTicket } from "gql/generated/types";
import { useUserTimeZone } from "hooks/useUserTimeZone";
import { string, numbers } from "utils";

const { toPercent } = numbers;
const { getDateCopy } = string;

interface AnnotationTicketRowProps {
  issueKey: string;
  url: string;
  jiraTicket?: JiraTicket;
  loading?: boolean;
  confidenceScore?: number;
}

export const AnnotationTicketRow: React.VFC<AnnotationTicketRowProps> = ({
  issueKey,
  url,
  jiraTicket,
  confidenceScore,
  loading = false,
}) => {
  const tz = useUserTimeZone();
  const annotationAnalytics = useAnnotationAnalytics();
  const fields = jiraTicket?.fields;
  const {
    created,
    assigneeDisplayName,
    assignedTeam,
    updated,
    summary,
    status,
  } = fields ?? {};

  return (
    <div data-cy="annotation-ticket-row">
      <JiraSummaryLink
        href={url}
        target="_blank"
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
      {loading ? (
        <LoadingWrapper data-cy="loading-annotation-ticket">
          <Skeleton active title={false} />
        </LoadingWrapper>
      ) : (
        <>
          {jiraTicket && (
            <StyledBadge data-cy={`${issueKey}-badge`} variant="lightgray">
              {status.name}
            </StyledBadge>
          )}
          {confidenceScore !== undefined && (
            <StyledBadge
              data-cy={`${issueKey}-confidence-badge`}
              variant="blue"
            >
              {toPercent(confidenceScore)}% Confident in suggestion
            </StyledBadge>
          )}
          <BottomMetaDataWrapper data-cy={`${issueKey}-metadata`}>
            {created && (
              <Disclaimer>
                Created: {getDateCopy(created, { dateOnly: true, tz })}
              </Disclaimer>
            )}
            {updated && (
              <Disclaimer>
                Updated: {getDateCopy(updated, { dateOnly: true, tz })}
              </Disclaimer>
            )}
            <Disclaimer>
              {assigneeDisplayName
                ? `Assignee: ${assigneeDisplayName}`
                : `Unassigned`}
            </Disclaimer>
            {assignedTeam && (
              <Disclaimer>Assigned Team: {assignedTeam}</Disclaimer>
            )}
          </BottomMetaDataWrapper>
        </>
      )}
    </div>
  );
};

const LoadingWrapper = styled.div`
  margin-top: ${size.xs};
`;

const JiraSummaryLink = styled(StyledLink)`
  font-weight: bold;
  margin-right: ${size.s};
`;

const StyledBadge = styled(Badge)`
  margin-right: ${size.s};
`;

const BottomMetaDataWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${size.xs};
  width: 80%;
`;
