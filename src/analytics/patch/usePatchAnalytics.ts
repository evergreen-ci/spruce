import { useQuery } from "@apollo/client";
import { addPageAction, Properties, Analytics } from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";
import {
  SaveSubscriptionForUserMutationVariables,
  PatchQuery,
  PatchQueryVariables,
  TaskSortCategory,
} from "gql/generated/types";
import { GET_PATCH } from "gql/queries";

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

interface P extends Properties {
  patchId: string;
  patchStatus: string;
}
interface PatchAnalytics extends Analytics<Action> {}

export const usePatchAnalytics = (id: string): PatchAnalytics => {
  const userId = useGetUserQuery();

  const { data: eventData } = useQuery<PatchQuery, PatchQueryVariables>(
    GET_PATCH,
    {
      variables: { id },
      fetchPolicy: "cache-first",
    }
  );
  const { status } = eventData?.patch || {};

  const sendEvent: PatchAnalytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "Patch",
      userId,
      patchStatus: status,
      patchId: id,
    });
  };

  return { sendEvent };
};
