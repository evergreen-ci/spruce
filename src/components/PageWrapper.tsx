import React from "react";
import styled from "@emotion/styled/macro";
import { Banners } from "components/Banners";
import { withBannersContext } from "hoc/withBannersContext";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";

export const Container = styled.div`
  padding: 0 8px;
  padding-bottom: 56px;
  background-color: white;
`;

export const PageWrapper: React.FC = withBannersContext(({ children }) => {
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();
  return (
    <Container>
      <Banners banners={bannersState} removeBanner={dispatchBanner.remove} />
      {children}
    </Container>
  );
});
