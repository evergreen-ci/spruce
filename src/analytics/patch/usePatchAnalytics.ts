import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { addPageAction, Properties, Analytics } from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";
import {
  SaveSubscriptionMutationVariables,
  PatchQuery,
  PatchQueryVariables,
} from "gql/generated/types";
import { GET_PATCH } from "gql/queries";

type Action =
  | { name: "Filter Tasks"; filterBy: string }
  | { name: "Restart"; abort: boolean }
  | { name: "Schedule" }
  | { name: "Set Priority"; priority: number }
  | { name: "Unschedule"; abort: boolean }
  | { name: "Change Page Size" }
  | { name: "Change Tab"; tab: string }
  | { name: "Click Task Square"; taskSquareStatus: string }
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
  | { name: "Click Base Commit Link" };

interface P extends Properties {
  patchId: string;
  patchStatus: string;
}
interface PatchAnalytics extends Analytics<Action> {}

export const usePatchAnalytics = (): PatchAnalytics => {
  const userId = useGetUserQuery();
  const { id } = useParams<{ id: string }>();
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
