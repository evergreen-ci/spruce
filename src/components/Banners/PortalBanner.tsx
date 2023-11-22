import { createPortal } from "react-dom";

interface PortalBannerProps {
  banner: React.ReactNode;
}

export const PortalBanner: React.FC<PortalBannerProps> = ({ banner }) => {
  const bannerContainerEl = document.getElementById("banner-container");
  return bannerContainerEl ? createPortal(banner, bannerContainerEl) : null;
};
