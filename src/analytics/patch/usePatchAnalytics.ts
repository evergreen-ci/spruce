import { useQuery } from "@apollo/client";
import get from "lodash/get";
import { useParams } from "react-router-dom";
import { addPageAction, Properties, Analytics } from "analytics/addPageAction";
import { GET_PATCH_EVENT_DATA } from "analytics/patch/query";
import { useGetUserQuery } from "analytics/useGetUserQuery";
import { SaveSubscriptionMutationVariables } from "gql/generated/types";
import { PatchStatus } from "types/patch";

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
  | {
      name: "Add Notification";
      subscription: SaveSubscriptionMutationVariables["subscription"];
    };

interface P extends Properties {
  patchId: string;
  patchStatus: PatchStatus;
}
interface PatchAnalytics extends Analytics<Action> {}

export const usePatchAnalytics = (): PatchAnalytics => {
  const userId = useGetUserQuery();
  const { id } = useParams<{ id: string }>();
  const { data: eventData } = useQuery(GET_PATCH_EVENT_DATA, {
    variables: { id },
  });
  const status = get(eventData, "patch.status", undefined);

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
