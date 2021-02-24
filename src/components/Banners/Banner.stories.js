import React from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Subtitle } from "@leafygreen-ui/typography";
import {
  BannerContextProvider,
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { Banner } from "./Banner";
import { Banners } from "./index";

export default {
  title: "Banners",
  component: Banners,
};

const ContextProvider = ({ children }) => (
  <BannerContextProvider>{children}</BannerContextProvider>
);

export const BannerContext = () => (
  <ContextProvider>
    <BannersExample />
  </ContextProvider>
);

const BannersExample = () => {
  const bannersState = useBannerStateContext();
  const banner = useBannerDispatchContext();
  return (
    <>
      <Banners banners={bannersState} removeBanner={banner.remove} />
      <StyledSubtitle>Click a button to render a banner</StyledSubtitle>
      <ButtonsWrapper>
        <Button onClick={() => banner.successBanner("I am so successful")}>
          Success
        </Button>
        <Button onClick={() => banner.errorBanner("I am a failure")}>
          Error
        </Button>
        <Button
          onClick={() =>
            banner.warningBanner("Not a failure but not a success either")
          }
        >
          Warning
        </Button>
        <Button
          onClick={() =>
            banner.infoBanner("I am a harmless informational banner")
          }
        >
          Info
        </Button>
        <Button onClick={() => banner.clearAllBanners()}>Clear All</Button>
      </ButtonsWrapper>
    </>
  );
};
const StyledSubtitle = styled(Subtitle)`
  margin-top: 16px;
`;
const ButtonsWrapper = styled.div`
  margin-top: 16px;
  & > :not(:last-child) {
    margin-right: 8px;
  }
`;

export const Success = () => (
  <Banner type="success">I am a banner and I have something to say!</Banner>
);
export const Error = () => (
  <Banner type="error">I am a banner and I have something to say!</Banner>
);
export const Warning = () => (
  <Banner type="warning">I am a banner and I have something to say!</Banner>
);
export const Info = () => (
  <Banner type="info">I am a banner and I have something to say!</Banner>
);
export const MultipleLinesOfText = () => (
  <Banner type="success">
    Now this is a story all about how my life got flipped-turned upside down and
    I&apos;d like to take a minute just sit right there I&apos;ll tell you how I
    became the prince of a town called Bel-Air. In west philadelphia born and
    raised on the playground was where I spent most of my days. Chillin&apos;
    out maxin&apos; relaxin&apos; all cool and all shooting some b-ball outside
    of the school when a couple of guys who were up to no good started making
    trouble in my neighborhood. I got in one little fight and my mom got scared
    she said, &quot;You&apos;re moving with your auntie and uncle in
    Bel-Air&quot;
  </Banner>
);
