import { useParams } from "react-router-dom";
import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";

type Action =
  | { name: "Change Page Size" }
  | { name: "Change Project" }
  | { name: "Click Patch Link" }
  | { name: "Click Variant Icon"; variantIconStatus: string }
  | { name: "Filter Commit Queue" }
  | { name: "Filter Patches"; filterBy: string };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useProjectPatchesAnalytics = (): Analytics => {
  const { projectIdentifier } = useParams<{ projectIdentifier: string }>();
  const userId = useGetUserQuery();
  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "ProjectPatches",
      projectIdentifier,
      userId,
    });
  };

  return { sendEvent };
};
