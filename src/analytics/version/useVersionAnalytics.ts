import { useQuery } from "@apollo/client";
import { addPageAction, Properties, Analytics } from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";
import {
  SaveSubscriptionForUserMutationVariables,
  VersionQuery,
  VersionQueryVariables,
  TaskSortCategory,
} from "gql/generated/types";
import { GET_VERSION } from "gql/queries";

type Action =
  | { name: "Filter Tasks"; filterBy: string }
  | {
      name: "Sort Tasks Table";
      sortBy:
        | TaskSortCategory.Name
        | TaskSortCategory.Status
        | TaskSortCategory.BaseStatus
        | TaskSortCategory.Variant;
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

interface V extends Properties {
  versionId: string;
  versionStatus: string;
}
interface VersionAnalytics extends Analytics<Action> {}

export const useVersionAnalytics = (id: string): VersionAnalytics => {
  const userId = useGetUserQuery();

  const { data: eventData } = useQuery<VersionQuery, VersionQueryVariables>(
    GET_VERSION,
    {
      fetchPolicy: "cache-first",
      variables: { id },
    }
  );
  const { status } = eventData?.version || {};

  const sendEvent: VersionAnalytics["sendEvent"] = (action) => {
    addPageAction<Action, V>(action, {
      object: "Version",
      userId,
      versionId: id,
      versionStatus: status,
    });
  };

  return { sendEvent };
};
