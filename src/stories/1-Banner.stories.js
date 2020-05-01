import React from "react";
import Button from "@leafygreen-ui/button";
import styled from "@emotion/styled";
import { Banners } from "components/Banner";
import {
  BannerContextProvider,
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { Subtitle } from "@leafygreen-ui/typography";

export default {
  title: "Banners",
  component: Banners,
  decorators: [withInfo],
};

const ContextProvider = ({ children }) => {
  return <BannerContextProvider>{children}</BannerContextProvider>;
};

export const UsingBannersWithContext = () => {
  return (
    <ContextProvider>
      <BannersExample />
    </ContextProvider>
  );
};

const BannersExample = () => {
  const bannersState = useBannerStateContext();
  const banner = useBannerDispatchContext();
  return (
    <>
      <Banners banners={bannersState} removeBanner={banner.remove} />
      <StyledSubtitle>Click a button to render a banner</StyledSubtitle>
      <ButtonsWrapper>
        <Button onClick={() => banner.success("I am so successful")}>
          Success
        </Button>
        <Button onClick={() => banner.error("I am a failure")}>Error</Button>
        <Button
          onClick={() =>
            banner.warning("Not a failure but not a success either")
          }
        >
          Warning
        </Button>
        <Button
          onClick={() => banner.info("I am a harmless informational banner")}
        >
          Info
        </Button>
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
