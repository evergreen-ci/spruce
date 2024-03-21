import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import { slugs } from "constants/routes";

type Action =
  | { name: "Save project"; section: string }
  | { name: "Save repo"; section: string }
  | { name: "Default section to repo"; section: string }
  | { name: "Attach project to repo"; repoOwner: string; repoName: string }
  | { name: "Detach project from repo"; repoOwner: string; repoName: string }
  | { name: "Move project to new repo"; repoOwner: string; repoName: string }
  | { name: "Create new project" }
  | { name: "Duplicate project"; projectIdToCopy: string };

export const useProjectSettingsAnalytics = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  return useAnalyticsRoot<Action>("ProjectSettings", { projectIdentifier });
};
