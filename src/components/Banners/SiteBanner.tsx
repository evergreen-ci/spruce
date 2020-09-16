import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import { uiColors } from "@leafygreen-ui/palette";
import Cookies from "js-cookie";
import { GetSpruceConfigQuery } from "gql/generated/types";
import { GET_SPRUCE_CONFIG } from "gql/queries";

const { yellow, blue, green, red } = uiColors;
export const SiteBanner = () => {
  const { data, loading } = useQuery<GetSpruceConfigQuery>(GET_SPRUCE_CONFIG);
  const siteBanner = data?.spruceConfig?.siteBanner;
  const text = siteBanner?.text ?? "";
  const theme = siteBanner?.theme ?? "";
  const [showBanner, setShowBanner] = useState(false);
  useEffect(() => {
    if (text !== "" && Cookies.get(text) === undefined) {
      setShowBanner(true);
    }
  }, [text]);
  if (loading) return null;

  const hideBanner = () => {
    // If a user sees a banner and closes it lets set a cookie with the banners text as the key.
    // The cookie will be auto deleted after a week. This ensures if a new banner with different text is returned we dont accidently hide it
    setShowBanner(false);
    Cookies.set(text, "viewed", { expires: 7 });
  };

  return showBanner ? (
    <Banner bannerTheme={theme} data-cy="sitewide-banner">
      {text}{" "}
      <IconButton
        aria-label="Close Site Banner"
        variant="light"
        onClick={hideBanner}
        data-cy="dismiss-sitewide-banner-button"
      >
        <Icon glyph="X" />{" "}
      </IconButton>
    </Banner>
  ) : (
    <BannerPadding />
  );
};

type BannerProps = {
  bannerTheme: string;
};

const Banner = styled.div`
  transition: max-height 0.3s ease-in-out;
  align-items: center;
  ${({ bannerTheme }: BannerProps) =>
    `background-color: ${
      bannerTheme
        ? bannerTypeToColor[bannerTheme]
        : bannerTypeToColor.announcement
    }`};
  display: flex;
  justify-content: space-between;
  padding: 5px 15px;
  margin-bottom: 15px;
`;

const BannerPadding = styled.div`
  margin-bottom: 16px;
`;

const bannerTypeToColor = {
  announcement: green.light2,
  information: blue.light2,
  warning: yellow.light2,
  important: red.light2,
};
