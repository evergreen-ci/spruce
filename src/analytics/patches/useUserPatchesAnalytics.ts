import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action =
  | { name: "Filter Patches"; filterBy: string }
  | { name: "Filter Commit Queue" }
  | { name: "Change Page Size" }
  | { name: "Click Patch Link" }
  | { name: "Click Variant Icon"; variantIconStatus: string };

export const useUserPatchesAnalytics = () =>
  useAnalyticsRoot<Action>("UserPatches");
