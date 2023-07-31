import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action = { name: "Triggered Konami Code" };

export const useAprilFoolsAnalytics = () =>
  useAnalyticsRoot<Action>("April Fools");
