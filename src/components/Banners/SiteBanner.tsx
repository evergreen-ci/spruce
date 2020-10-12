import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import Cookies from "js-cookie";
import { styles } from "components/Banners";
import { GetSpruceConfigQuery } from "gql/generated/types";
import { GET_SPRUCE_CONFIG } from "gql/queries";

const { Banner, BannerPadding } = styles;

export const SiteBanner = () => {
  const { data, loading } = useQuery<GetSpruceConfigQuery>(GET_SPRUCE_CONFIG);
  const spruceConfig = data?.spruceConfig;
  const text = spruceConfig?.banner ?? "";
  const theme = spruceConfig?.bannerTheme ?? "";
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
