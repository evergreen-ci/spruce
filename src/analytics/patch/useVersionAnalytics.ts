import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { addPageAction, Properties, Analytics } from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";
import {
  SaveSubscriptionMutationVariables,
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
  | { name: "Enqueue" }
  | { name: "Open Notification Modal" }
  | { name: "Click Task Table Link"; taskId: string }
  | { name: "Clear all filter" }
  | {
      name: "Add Notification";
      subscription: SaveSubscriptionMutationVariables["subscription"];
    }
  | { name: "Toggle Display Task Dropdown"; expanded: boolean }
  | { name: "Click Base Commit Link" }
  | { name: "Open Schedule Tasks Modal" };

interface V extends Properties {
  versionId: string;
  versionStatus: string;
}
interface VersionAnalytics extends Analytics<Action> {}

export const useVersionAnalytics = (): VersionAnalytics => {
  const userId = useGetUserQuery();
  const { id } = useParams<{ id: string }>();
  const { data: eventData } = useQuery<VersionQuery, VersionQueryVariables>(
    GET_VERSION,
    {
      variables: { id },
      fetchPolicy: "cache-first",
    }
  );
  const { status } = eventData?.version || {};

  const sendEvent: VersionAnalytics["sendEvent"] = (action) => {
    addPageAction<Action, V>(action, {
      object: "Version",
      userId,
      versionStatus: status,
      versionId: id,
    });
  };

  return { sendEvent };
};
