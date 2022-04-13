import styled from "@emotion/styled";
import {
  SiteBanner,
  ConnectivityBanner,
  SlackNotificationBanner,
} from "components/Banners";
import { Navbar } from "./Navbar";

export const Header: React.VFC = () => (
  <StyledHeader>
    <Navbar />
    <ConnectivityBanner />
    <SiteBanner />
    <SlackNotificationBanner />
  </StyledHeader>
);

const StyledHeader = styled.header`
  grid-area: header;
`;
