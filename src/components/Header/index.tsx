import styled from "@emotion/styled";
import {
  AdminBanner,
  ConnectivityBanner,
  SlackNotificationBanner,
  GithubUsernameBanner,
} from "components/Banners";
import { useNetworkStatus, usePageVisibility } from "hooks";
import { Navbar } from "./Navbar";

// Since the Header is present on all Spruce pages, we can monitor network status and page visibility
// for the entire app here.
export const Header: React.FC = () => {
  usePageVisibility(true);
  useNetworkStatus(true);
  return (
    <StyledHeader>
      <Navbar />
      <BannerContainer id="banner-container">
        <AdminBanner />
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
  > * {
    margin: 12px;
  }
`;
