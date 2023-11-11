import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action =
  | { name: "Change Page Size" }
  | { name: "Click Patch Link" }
  | { name: "Click Variant Icon"; variantIconStatus: string }
  | { name: "Filter Commit Queue" }
  | { name: "Filter Hidden"; includeHidden: boolean }
  | { name: "Filter Patches"; filterBy: string };

export const useUserPatchesAnalytics = () =>
  useAnalyticsRoot<Action>("UserPatches");
