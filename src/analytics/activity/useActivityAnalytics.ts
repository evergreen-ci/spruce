import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action =
  | { name: "Tab Active"; status: "online" | "visible" }
  | { name: "Tab Not Active" };

export const useActivityAnalytics = () => useAnalyticsRoot<Action>("Polling");
