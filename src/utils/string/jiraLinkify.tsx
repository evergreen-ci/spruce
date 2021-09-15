import ReactDOMServer from "react-dom/server";
import { StyledLink } from "components/styles/StyledLink";
import { getJiraTicketUrl } from "constants/externalResources";

export const jiraLinkify = (unlinkified: string, jiraHost: string) =>
  unlinkified.replace(/[A-Z]{1,10}-\d{1,6}/gi, (match) =>
    ReactDOMServer.renderToString(
      <StyledLink href={getJiraTicketUrl(jiraHost, match)}>{match}</StyledLink>
    )
  );
