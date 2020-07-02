import { PatchStatus } from "types/patch";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import get from "lodash/get";
import { GET_PATCH_EVENT_DATA } from "analytics/patch/query";
import { addPageAction, Properties, Analytics } from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";

type Action =
  | { name: "Filter Tasks"; filterBy: string }
  | { name: "Restart"; abort: boolean }
  | { name: "Schedule" }
  | { name: "Set Priority"; priority: number }
  | { name: "Unschedule"; abort: boolean }
  | { name: "Change Page Size" }
  | { name: "Change Tab"; tab: string }
  | { name: "Click Task Square"; taskSquareStatus: string }
  | { name: "Click Reconfigure Link" }
  | { name: "Enqueue" };

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
    fetchPolicy: "cache-first",
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
