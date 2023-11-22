import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import { Disclaimer } from "@leafygreen-ui/typography";
import { useAnnotationAnalytics } from "analytics";
import { StyledLink } from "components/styles";
import { getJiraTicketUrl } from "constants/externalResources";
import { size } from "constants/tokens";
import { TicketFields } from "gql/generated/types";
import { useSpruceConfig, useDateFormat } from "hooks";
import { trimStringFromMiddle } from "utils/string";

const { gray } = palette;
interface JiraTicketRowProps {
  jiraKey: string;
  fields: TicketFields;
}
const JiraTicketRow: React.FC<JiraTicketRowProps> = ({ fields, jiraKey }) => {
  const annotationAnalytics = useAnnotationAnalytics();
  const getDateCopy = useDateFormat();
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;
  const url = getJiraTicketUrl(jiraHost, jiraKey);
  const { assigneeDisplayName, created, status, summary, updated } =
    fields ?? {};
  return (
    <Container data-cy="jira-ticket-row">
      <JiraSummaryLink
        href={url}
        data-cy={jiraKey}
        onClick={() =>
          annotationAnalytics.sendEvent({ name: "Click Jira Summary Link" })
        }
        title={summary}
      >
        {jiraKey}: {trimStringFromMiddle(summary, 80)} {"   "}
      </JiraSummaryLink>

      <Badge data-cy={`${jiraKey}-badge`} variant="lightgray">
        {status.name}
      </Badge>

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
    </Container>
  );
};

const Container = styled.div`
  padding: ${size.xs};
  :hover {
    background-color: ${gray.light3};
  }
`;
const BottomMetaDataWrapper = styled.div`
  margin-top: ${size.xs};
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: ${size.xs};
  grid-template-rows: 1fr;
  grid-row-gap: 0px;
  width: 80%;
`;

const JiraSummaryLink = styled(StyledLink)`
  font-weight: bold;
  margin-right: ${size.s};
`;

export default JiraTicketRow;
