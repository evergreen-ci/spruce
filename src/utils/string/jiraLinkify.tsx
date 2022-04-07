import reactStringReplace from "react-string-replace";
import { StyledLink } from "components/styles";
import { getJiraTicketUrl } from "constants/externalResources";

export const jiraLinkify = (
  unlinkified: string | React.ReactNodeArray,
  jiraHost: string,
  onClick: () => void = () => {}
) =>
  reactStringReplace(unlinkified, /([A-Z]{1,10}-\d{1,6})/g, (match, i) => (
    <StyledLink
      onClick={onClick}
      key={`${match}${i}`}
      href={getJiraTicketUrl(jiraHost, match)}
    >
      {match}
    </StyledLink>
  ));
