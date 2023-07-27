import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action =
  | { name: "Select Distro"; distro: string }
  | { name: "Click Task Link" }
  | { name: "Click Version Link" };

export const useTaskQueueAnalytics = () =>
  useAnalyticsRoot<Action>("TaskQueue");
