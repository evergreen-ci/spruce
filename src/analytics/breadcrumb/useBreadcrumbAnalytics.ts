import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action = {
  name: "Click Link";
  link: "myPatches" | "patch" | "version" | "waterfall" | "displayTask";
};

export const useBreadcrumbAnalytics = () =>
  useAnalyticsRoot<Action>("Breadcrumb");
