import { useSpruceConfig } from "hooks";
import { SiteBanner } from "./SiteBanner";

export const AdminBanner = () => {
  const spruceConfig = useSpruceConfig();
  const text = spruceConfig?.banner ?? "";
  const theme = spruceConfig?.bannerTheme ?? "";
  if (!text) {
    return null;
  }
  return <SiteBanner text={text} theme={theme} />;
};
