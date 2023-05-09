import { useSpruceConfig } from "hooks";
import { SiteBanner } from "./SiteBanner";

export const AdminBanner = () => {
  const spruceConfig = useSpruceConfig();
  const text = spruceConfig?.banner ?? "";
  const theme = spruceConfig?.bannerTheme ?? "";
  return <SiteBanner text={text} theme={theme} />;
};
