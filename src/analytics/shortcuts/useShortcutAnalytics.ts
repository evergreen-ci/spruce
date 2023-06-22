import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action = { name: "Used Shortcut"; keys: string };

export const useShortcutAnalytics = () => useAnalyticsRoot<Action>("Shortcut");
