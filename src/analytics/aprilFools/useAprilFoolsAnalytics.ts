import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action = { name: "2024 Boilerplate!" };

export const useAprilFoolsAnalytics = () =>
  useAnalyticsRoot<Action>("April Fools");
