import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import IconButton from "@leafygreen-ui/icon-button";
import Icon from "@leafygreen-ui/icon";
import Cookies from "js-cookie";
import get from "lodash.get";
import { GET_SITE_BANNER } from "gql/queries";
import { SiteBannerQuery } from "gql/generated/types";

const { yellow, blue, green, red } = uiColors;
export const SiteBanner = () => {
  const { data, loading } = useQuery<SiteBannerQuery>(GET_SITE_BANNER);
  const { text, theme } = get(data, "siteBanner", {});
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
    <Banner theme={theme}>
      {text}{" "}
      <IconButton
        aria-label="Close Site Banner"
        variant="light"
        onClick={hideBanner}
      >
        <Icon glyph="X" onClick={hideBanner} />{" "}
      </IconButton>
    </Banner>
  ) : (
    <BannerPadding />
  );
};

type BannerProps = {
  theme: string;
};

const Banner = styled.div`
  transition: max-height 0.3s ease-in-out;
  align-items: center;
  ${(props: BannerProps) =>
    props.theme && `background-color: ${bannerTypeToColor[props.theme]}`};
  display: flex;
  justify-content: space-between;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
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
