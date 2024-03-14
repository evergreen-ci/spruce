import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import {
  ProjectHealthView,
  SaveSubscriptionForUserMutationVariables,
} from "gql/generated/types";

type pageType = "Commit chart" | "Task history" | "Variant history";
type Action =
  | {
      name: "Click task cell";
      taskStatus: string;
    }
  | { name: "Paginate"; direction: "previous" | "next" }
  | { name: "Select project" }
  | { name: "Submit failed test filter" }
  | { name: "Clear all badges" }
  | { name: "Click grouped task status badge"; statuses: string[] }
  | { name: "Click task status icon"; status: string }
  | {
      name: "Click commit label";
      link: "jira" | "githash" | "upstream project";
      commitType: "active" | "inactive";
    }
  | { name: "Click variant label" }
  | { name: "Select chart view option"; viewOption: string }
  | { name: "Click column header" }
  | { name: "Filter by task" }
  | { name: "Filter by requester"; requesters: string[] }
  | { name: "Filter by task status"; statuses: string[] }
  | { name: "Toggle task icons legend"; toggle: "open" | "close" }
  | { name: "Open hidden commits modal" }
  | { name: "Remove badge" }
  | {
      name: "Filter by build variant";
    }
  | { name: "Toggle folded commit"; toggle: "open" | "close" }
  | {
      name: "Toggle commit chart label tooltip";
    }
  | { name: "Open Notification Modal" }
  | { name: "Open Git Commit Search Modal" }
  | { name: "Search for commit"; commit: string }
  | {
      name: "Add Notification";
      subscription: SaveSubscriptionForUserMutationVariables["subscription"];
    }
  | { name: "Toggle view"; toggle: ProjectHealthView }
  | {
      name: "Redirect to Project Identifier";
      projectId: string;
      projectIdentifier: string;
    };

export const useProjectHealthAnalytics = (p: { page: pageType }) =>
  useAnalyticsRoot<Action>("ProjectHealthPages", { page: p.page });
