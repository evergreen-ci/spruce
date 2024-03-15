import { useQuery } from "@apollo/client";
import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import {
  SaveSubscriptionForUserMutationVariables,
  PatchQuery,
  PatchQueryVariables,
  TaskSortCategory,
} from "gql/generated/types";
import { PATCH } from "gql/queries";

type Action =
  | { name: "Filter Tasks Table"; filterBy: string | string[] }
  | {
      name: "Sort Tasks Table";
      sortBy: TaskSortCategory | TaskSortCategory[];
    }
  | {
      name: "Sort Downstream Tasks Table";
      sortBy:
        | TaskSortCategory.Name
        | TaskSortCategory.Status
        | TaskSortCategory.BaseStatus
        | TaskSortCategory.Variant;
    }
  | { name: "Restart"; abort: boolean }
  | { name: "Schedule" }
  | { name: "Set Priority"; priority: number }
  | { name: "Unschedule"; abort: boolean }
  | { name: "Change Page Size" }
  | { name: "Change Tab"; tab: string }
  | { name: "Click Grouped Task Square"; taskSquareStatuses: string | string[] }
  | { name: "Click Build Variant Grid Link" }
  | { name: "Click Reconfigure Link" }
  | { name: "Enqueue" }
  | { name: "Open Notification Modal" }
  | { name: "Click Task Table Link"; taskId: string }
  | { name: "Clear all filter" }
  | {
      name: "Add Notification";
      subscription: SaveSubscriptionForUserMutationVariables["subscription"];
    }
  | { name: "Toggle Display Task Dropdown"; expanded: boolean }
  | { name: "Set Patch Visibility"; hidden: boolean }
  | { name: "Click Base Commit Link" }
  | { name: "Open Schedule Tasks Modal" };

export const usePatchAnalytics = (id: string) => {
  const { data: eventData } = useQuery<PatchQuery, PatchQueryVariables>(PATCH, {
    variables: { id },
    fetchPolicy: "cache-first",
  });
  const { status } = eventData?.patch || {};

  return useAnalyticsRoot<Action>("Patch", {
    patchStatus: status,
    patchId: id,
  });
};
