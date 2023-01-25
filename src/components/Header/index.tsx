import styled from "@emotion/styled";
import {
  SiteBanner,
  ConnectivityBanner,
  SlackNotificationBanner,
  GithubUsernameBanner,
} from "components/Banners";
import { zIndex } from "constants/tokens";
import { useNetworkStatus, usePageVisibility } from "hooks";
import { Navbar } from "./Navbar";

// Since the Header is present on all Spruce pages, we can monitor network status and page visibility
// for the entire app here.
export const Header: React.VFC = () => {
  usePageVisibility(true);
  useNetworkStatus(true);
  return (
    <StyledHeader>
      <Navbar />
      <BannerContainer>
        <SiteBanner />
        <ConnectivityBanner />
        <GithubUsernameBanner />
        <SlackNotificationBanner />
      </BannerContainer>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  grid-area: header;
`;

const BannerContainer = styled.div`
  position: absolute;
  z-index: ${zIndex.toast};
  width: 100%;
  > * {
    margin: 12px;
  }
`;
