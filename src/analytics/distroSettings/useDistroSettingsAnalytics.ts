import { useParams } from "react-router-dom";
import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";

type Action =
  | { name: "Save distro"; section: string }
  | { name: "Create new distro" }
  | { name: "Duplicate distro"; distroIdToCopy: string };

interface P extends Properties {}

export interface Analytics extends A<Action> {}

export const useDistroSettingsAnalytics = (): Analytics => {
  const { distroId } = useParams<{ distroId: string }>();

  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "DistroSettings",
      distroId,
    });
  };

  return { sendEvent };
};
