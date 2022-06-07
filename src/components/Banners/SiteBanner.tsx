import { useState, useEffect } from "react";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import Cookies from "js-cookie";
import { useSpruceConfig } from "hooks";
import { jiraLinkify } from "utils/string/jiraLinkify";
import { DismissibleBanner } from "./styles";

export const SiteBanner = () => {
  const spruceConfig = useSpruceConfig();
  const text = spruceConfig?.banner ?? "";
  const theme = spruceConfig?.bannerTheme ?? "";
  const jiraHost = spruceConfig?.jira?.host;
  const [showBanner, setShowBanner] = useState(false);
  useEffect(() => {
    if (text !== "" && Cookies.get(text) === undefined) {
      setShowBanner(true);
    }
  }, [text]);

  const hideBanner = () => {
    // If a user sees a banner and closes it lets set a cookie with the banners text as the key.
    // The cookie will be auto deleted after a week. This ensures if a new banner with different text is returned we dont accidently hide it
    setShowBanner(false);
    Cookies.set(text, "viewed", { expires: 7 });
  };

  return (
    showBanner && (
      <DismissibleBanner bannerTheme={theme} data-cy="sitewide-banner">
        <span>{jiraLinkify(text, jiraHost)}</span>
        <IconButton
          aria-label="Close Site Banner"
          onClick={hideBanner}
          data-cy="dismiss-sitewide-banner-button"
        >
          <Icon glyph="X" />{" "}
        </IconButton>
      </DismissibleBanner>
    )
  );
};
