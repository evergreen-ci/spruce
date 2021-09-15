import ReactDOMServer from "react-dom/server";
import { StyledLink } from "components/styles/StyledLink";

export const githubPRLinkify = (unlinkified: string) =>
  unlinkified.replace(
    /https:\/\/github.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/pull\/\d+/gi,
    (match) =>
      ReactDOMServer.renderToString(
        <StyledLink href={match}>{match}</StyledLink>
      )
  );
