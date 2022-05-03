import { useParams } from "react-router-dom";
import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";

type Action =
  | { name: "Filter Patches"; filterBy: string }
  | { name: "Filter Commit Queue" }
  | { name: "Change Page Size" }
  | { name: "Click Patch Link" }
  | { name: "Click Variant Icon"; variantIconStatus: string };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useProjectPatchesAnalytics = (): Analytics => {
  const { id: projectId } = useParams<{ id: string }>();
  const userId = useGetUserQuery();
  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "ProjectPatches",
      userId,
      projectId,
    });
  };

  return { sendEvent };
};
