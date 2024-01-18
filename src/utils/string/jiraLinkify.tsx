import reactStringReplace from "react-string-replace";
import { StyledLink } from "components/styles";
import { getJiraTicketUrl } from "constants/externalResources";

export const jiraLinkify = (
  unlinkified: string | React.ReactNode[],
  jiraHost: string,
  onClick?,
) =>
  reactStringReplace(unlinkified, /([A-Z]{1,10}-\d{1,6})/g, (match, i) => (
    <StyledLink
      data-cy="jira-link"
      onClick={onClick}
      key={`${match}${i}`}
      href={getJiraTicketUrl(jiraHost, match)}
    >
      {match}
    </StyledLink>
  ));
