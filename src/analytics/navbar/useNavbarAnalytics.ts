import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";

type Action =
  | { name: "Click Legacy UI Link" }
  | { name: "Click Logo Link" }
  | { name: "Click Waterfall Link" };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useNavbarAnalytics = (): Analytics => {
  const userId = useGetUserQuery();

  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "Navbar",
      userId,
    });
  };

  return { sendEvent };
};
