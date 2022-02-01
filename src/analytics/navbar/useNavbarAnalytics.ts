import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";

type Action =
  | { name: "Click Legacy UI Link" }
  | { name: "Click Logo Link" }
  | { name: "Click Waterfall Link" }
  | { name: "Click Legacy Waterfall Link" }
  | { name: "Click My Patches Link" }
  | { name: "Click My Hosts Link" }
  | { name: "Click All Hosts Link" }
  | { name: "Click Distros Link" }
  | { name: "Click Projects Link" }
  | { name: "Click Project Patches Link" }
  | { name: "Click Preferences Link" }
  | { name: "Click Notifications Link" };

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
