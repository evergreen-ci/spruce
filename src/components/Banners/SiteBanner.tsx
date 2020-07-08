import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Icon from "@leafygreen-ui/icon";
import Cookies from "js-cookie";
import get from "lodash.get";
import { GET_SITE_BANNER } from "gql/queries";
import { SiteBannerQuery } from "gql/generated/types";

const { yellow, blue, green, red } = uiColors;
export const SiteBanner = () => {
  const { data, loading } = useQuery<SiteBannerQuery>(GET_SITE_BANNER);
  const { text, theme } = get(data, "siteBanner", {});
  const shouldShowBanner =
    text && text.length > 0 && Cookies.get(text) === undefined;
  console.log(text);
  const [showBanner, setShowBanner] = useState(shouldShowBanner);
  if (loading) return null;

  const hideBanner = () => {
    // If a user sees a banner and closes it lets set a cookie with the banners text as the key.
    // The cookie will be auto deleted after a week. This ensures if a new banner with different text is returned we dont accidently hide it
    setShowBanner(false);
    Cookies.set(text, "viewed", { expires: 7 });
  };

  return (
    <Banner theme={theme}>
      {showBanner && (
        <>
          {text} <Icon glyph="X" onClick={hideBanner} />
        </>
      )}
    </Banner>
  );
};
type BannerProps = {
  theme: string;
};

const Banner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props: BannerProps) =>
    props.theme && `background-color: ${bannerTypeToColor[props.theme]}`};
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-bottom: 16px;
`;

const bannerTypeToColor = {
  announcement: green.light2,
  information: blue.light2,
  warning: yellow.light2,
  important: red.light2,
};
