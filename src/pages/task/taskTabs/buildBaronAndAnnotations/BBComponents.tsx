import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Disclaimer, Subtitle } from "@leafygreen-ui/typography";
import { useAnnotationAnalytics } from "analytics";
import { StyledLink } from "components/styles";
import { getJiraTicketUrl } from "constants/externalResources";
import { size } from "constants/tokens";
import { TicketFields } from "gql/generated/types";
import { useSpruceConfig } from "hooks";
import { string } from "utils";

const { getDateCopy } = string;
interface TitleProps {
  margin?: boolean;
}

interface JiraTicketRowProps {
  jiraKey: string;
  fields: TicketFields;
}
export const JiraTicketRow: React.VFC<JiraTicketRowProps> = ({
  jiraKey,
  fields,
}) => {
  const annotationAnalytics = useAnnotationAnalytics();

  const spruceConfig = useSpruceConfig();
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

// @ts-expect-error
export const TicketsTitle = styled(Subtitle)<TitleProps>`
  margin-bottom: ${(props) => (props.margin ? size.s : size.xxs)};
  margin-top: ${(props) => (props.margin ? size.m : size.l)};
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
  gap: ${size.xs};
  grid-template-rows: 1fr;
  grid-row-gap: 0px;
  width: 80%;
`;

export const TopMetaDataWrapper = styled.div`
  margin-bottom: ${size.xs};
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: ${size.xs};
  grid-template-rows: 1fr;
  grid-row-gap: 0px;
  width: 80%;
`;

export const NonTableWrapper = styled.div`
  margin-left: ${size.s};
`;

export const ButtonWrapper = styled.div`
  margin-right: ${size.xs};
  padding-top: ${size.s};
`;
