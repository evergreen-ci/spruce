import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";

type Action =
  | { name: "Change Page Size" }
  | { name: "Change Project" }
  | { name: "Click Patch Link" }
  | { name: "Click Variant Icon"; variantIconStatus: string }
  | { name: "Filter Commit Queue" }
  | { name: "Filter Hidden"; includeHidden: boolean }
  | { name: "Filter Patches"; filterBy: string };

export const useProjectPatchesAnalytics = () => {
  const { projectIdentifier } = useParams<{ projectIdentifier: string }>();
  return useAnalyticsRoot<Action>("ProjectPatches", { projectIdentifier });
};
