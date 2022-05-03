import { StyledLink } from "components/styles";
import reactStringReplace from "react-string-replace";

export const githubPRLinkify = (unlinkified: string | React.ReactNodeArray) =>
  reactStringReplace(
    unlinkified,
    /(https:\/\/github.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/pull\/\d+)/g,
    (match, i) => (
      <StyledLink key={`${match}${i}`} href={match}>
        {match}
      </StyledLink>
    )
  );
