import React from "react";
import styled from "@emotion/styled";
import { BannerObj } from "context/banners";
import { Banner } from "components/Banners/Banner";

interface BannersProps {
  banners: BannerObj[];
  removeBanner: (bannerId: string) => void;
}

export const Banners: React.FC<BannersProps> = ({ banners, removeBanner }) => {
  if (!banners || banners.length === 0) {
    return null;
  }
  return (
    <BannersWrapper data-cy="banners-wrapper">
      {banners
        .sort((a) => (a.type === "warning" ? -1 : 1))
        .map(({ id, type, message }) => (
          <Banner key={id} {...{ id, type, removeBanner }}>
            {message}
          </Banner>
        ))}
    </BannersWrapper>
  );
};

const BannersWrapper = styled.div`
  margin-bottom: 16px;
  & > :not(:last-child) {
    margin-bottom: 8px;
  }
`;
