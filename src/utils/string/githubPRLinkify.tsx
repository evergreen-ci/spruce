import reactStringReplace from "react-string-replace";
import { StyledLink } from "components/styles";

export const githubPRLinkify = (unlinkified: string | React.ReactNode[]) =>
  reactStringReplace(
    unlinkified,
    /(https:\/\/github.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/pull\/\d+)/g,
    (match, i) => (
      <StyledLink key={`${match}${i}`} href={match}>
        {match}
      </StyledLink>
    ),
  );
