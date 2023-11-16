import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action =
  | { name: "Filter Hosts"; filterBy: string | string[] }
  | { name: "Sort Hosts" }
  | { name: "Change Page Size" }
  | { name: "Restart Jasper" }
  | { name: "Reprovision Host" }
  | { name: "Update Status"; status: string };

export const useHostsTableAnalytics = (isHostPage?: boolean) =>
  useAnalyticsRoot<Action>(isHostPage ? "HostPage" : "HostsTable");
