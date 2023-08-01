import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action =
  | { name: "Filter Job Logs"; filterBy: string }
  | { name: "Clicked lobster testlog url"; testId: string }
  | { name: "Clicked HTML testlog url"; testId: string }
  | { name: "Clicked complete logs link"; buildId: string }
  | { name: "Clicked Parsley test log link"; buildId: string };

export const useJobLogsAnalytics = () => useAnalyticsRoot<Action>("JobLogs");
