import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action =
  | { name: "Click Admin Link" }
  | { name: "Click Legacy UI Link" }
  | { name: "Click Logo Link" }
  | { name: "Click Waterfall Link" }
  | { name: "Click Legacy Waterfall Link" }
  | { name: "Click My Patches Link" }
  | { name: "Click My Hosts Link" }
  | { name: "Click All Hosts Link" }
  | { name: "Click Distros Link" }
  | { name: "Click Projects Link" }
  | { name: "Click Project Patches Link" }
  | { name: "Click EVG Wiki Link" }
  | { name: "Click Preferences Link" }
  | { name: "Click Notifications Link" }
  | { name: "Click Task Queue Link" }
  | { name: "Click Commit Queue Link" };

export const useNavbarAnalytics = () => useAnalyticsRoot<Action>("Navbar");
