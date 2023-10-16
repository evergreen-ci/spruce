import Banner, { Variant } from "@leafygreen-ui/banner";
import { StyledLink } from "components/styles";
import { ignoredFilesDocumentationUrl } from "constants/externalResources";
import { BannerContainer } from "../styles";

const IgnoredBanner: React.FC = () => (
  <BannerContainer data-cy="ignored-banner">
    <Banner variant={Variant.Info}>
      This revision will not be automatically scheduled, because only{" "}
      <StyledLink href={ignoredFilesDocumentationUrl} target="_blank">
        ignored files
      </StyledLink>{" "}
      are changed. It may still be scheduled manually, or on failure stepback.
    </Banner>
  </BannerContainer>
);

export default IgnoredBanner;
