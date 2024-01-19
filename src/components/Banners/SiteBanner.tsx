import { useState } from "react";
import Banner, { Variant } from "@leafygreen-ui/banner";
import Cookies from "js-cookie";
import { useSpruceConfig } from "hooks";
import { jiraLinkify } from "utils/string/jiraLinkify";

export interface SiteBannerProps {
  text: string;
  theme: string;
}
export const SiteBanner: React.FC<SiteBannerProps> = ({ text, theme }) => {
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;
  const [showBanner, setShowBanner] = useState(
    text && Cookies.get(text) === undefined,
  );

  const hideBanner = () => {
    // If a user sees a banner and closes it lets set a cookie with the banners text as the key.
    // The cookie will be auto deleted after a week. This ensures if a new banner with different text is returned we dont accidently hide it
    setShowBanner(false);
    Cookies.set(text, "viewed", { expires: 7 });
  };

  const variant = mapThemeToVariant[theme?.toLowerCase()] ?? Variant.Info;
  return showBanner ? (
    <Banner
      data-cy={`sitewide-banner-${variant}`}
      dismissible
      onClose={hideBanner}
      variant={variant}
    >
      {jiraLinkify(text, jiraHost)}
    </Banner>
  ) : null;
};

const mapThemeToVariant: Record<string, Variant> = {
  announcement: Variant.Success,
  information: Variant.Info,
  warning: Variant.Warning,
  important: Variant.Danger,
};
