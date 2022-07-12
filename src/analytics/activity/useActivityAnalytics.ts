import { addPageAction, Properties, Analytics } from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";

type Action =
  | { name: "Tab Active"; status: "online" | "visible" }
  | { name: "Tab Not Active" };

interface P extends Properties {}
interface ActivityAnalytics extends Analytics<Action> {}

export const useActivityAnalytics = (): ActivityAnalytics => {
  const userId = useGetUserQuery();

  const sendEvent: ActivityAnalytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "Polling",
      userId,
    });
  };

  return { sendEvent };
};
