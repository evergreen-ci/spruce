import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Disclaimer } from "@leafygreen-ui/typography";
import { useAnnotationAnalytics } from "analytics";
import { StyledLink } from "components/styles";
import { getJiraTicketUrl } from "constants/externalResources";
import { size } from "constants/tokens";
import { TicketFields } from "gql/generated/types";
import { useSpruceConfig, useDateFormat } from "hooks";

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
    </div>
  );
};

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
