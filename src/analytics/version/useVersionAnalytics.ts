import { useQuery } from "@apollo/client";
import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import {
  SaveSubscriptionForUserMutationVariables,
  VersionQuery,
  VersionQueryVariables,
  TaskSortCategory,
} from "gql/generated/types";
import { VERSION } from "gql/queries";

type Action =
  | { name: "Filter Tasks Table"; filterBy: string | string[] }
  | {
      name: "Sort Tasks Table";
      sortBy: TaskSortCategory | TaskSortCategory[];
    }
  | {
      name: "Filter Downstream Tasks Table";
      filterBy: string | string[];
    }
  | {
      name: "Sort Downstream Tasks Table";
      sortBy: TaskSortCategory | TaskSortCategory[];
    }
  | { name: "Filter Tasks Duration Table"; filterBy: string | string[] }
  | { name: "Restart"; abort: boolean }
  | { name: "Schedule" }
  | { name: "Set Priority"; priority: number }
  | { name: "Unschedule"; abort: boolean }
  | { name: "Change Page Size" }
  | { name: "Change Tab"; tab: string }
  | { name: "Click Grouped Task Square"; taskSquareStatuses: string | string[] }
  | { name: "Click Build Variant Grid Link" }
  | { name: "Click Reconfigure Link" }
  | { name: "Click Project Patches Metadata Link" }
  | { name: "Enqueue" }
  | { name: "Open Notification Modal" }
  | { name: "Click Task Table Link"; taskId: string }
  | { name: "Clear all filter" }
  | {
      name: "Add Notification";
      subscription: SaveSubscriptionForUserMutationVariables["subscription"];
    }
  | { name: "Toggle Display Task Dropdown"; expanded: boolean }
  | { name: "Click Base Commit Link" }
  | { name: "Click Previous Version Link" }
  | { name: "Click Github Commit Link" }
  | { name: "Open Schedule Tasks Modal" };

export const useVersionAnalytics = (id: string) => {
  const { data: eventData } = useQuery<VersionQuery, VersionQueryVariables>(
    VERSION,
    {
      variables: { id },
      fetchPolicy: "cache-first",
    },
  );
  const { status } = eventData?.version || {};

  return useAnalyticsRoot<Action>("Version", {
    versionStatus: status,
    versionId: id,
  });
};
