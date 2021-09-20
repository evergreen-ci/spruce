import reactStringReplace from "react-string-replace";
import { StyledLink } from "components/styles/StyledLink";
import { getJiraTicketUrl } from "constants/externalResources";

export const jiraLinkify = (
  unlinkified: string | React.ReactNodeArray,
  jiraHost: string
) =>
  reactStringReplace(unlinkified, /([A-Z]{1,10}-\d{1,6})/gi, (match, i) => (
    <StyledLink key={`${match}${i}`} href={getJiraTicketUrl(jiraHost, match)}>
      {match}
    </StyledLink>
  ));
