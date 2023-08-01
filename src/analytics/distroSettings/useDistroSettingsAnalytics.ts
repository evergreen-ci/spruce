import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action =
  | { name: "Save distro"; section: string }
  | { name: "Create new distro"; newDistroId: string }
  | { name: "Duplicate distro"; newDistroId: string };

export const useDistroSettingsAnalytics = () => {
  const { distroId } = useParams<{ distroId: string }>();
  return useAnalyticsRoot<Action>("DistroSettings", { distroId });
};
