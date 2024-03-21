import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import { slugs } from "constants/routes";

type Action =
  | { name: "Save distro"; section: string }
  | { name: "Create new distro"; newDistroId: string }
  | { name: "Duplicate distro"; newDistroId: string };

export const useDistroSettingsAnalytics = () => {
  const { [slugs.distroId]: distroId } = useParams();
  return useAnalyticsRoot<Action>("DistroSettings", { distroId });
};
