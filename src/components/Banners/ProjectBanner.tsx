import { createPortal } from "react-dom";
import { SiteBanner, SiteBannerProps } from "./SiteBanner";

interface ProjectBannerProps extends SiteBannerProps {}
export const ProjectBanner: React.FC<ProjectBannerProps> = ({
  theme,
  text,
}) => {
  const bannerContainerEl = document.getElementById("banner-container");
  return (
    bannerContainerEl &&
    createPortal(<SiteBanner text={text} theme={theme} />, bannerContainerEl)
  );
};
