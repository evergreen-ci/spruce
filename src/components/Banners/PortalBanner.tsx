import { createPortal } from "react-dom";
import { SiteBanner, SiteBannerProps } from "./SiteBanner";

interface PortalBannerProps extends SiteBannerProps {}
export const PortalBanner: React.FC<PortalBannerProps> = ({ text, theme }) => {
  const bannerContainerEl = document.getElementById("banner-container");
  return bannerContainerEl
    ? createPortal(<SiteBanner text={text} theme={theme} />, bannerContainerEl)
    : null;
};
