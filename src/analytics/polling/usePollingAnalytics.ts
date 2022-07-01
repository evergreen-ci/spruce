import { addPageAction, Properties, Analytics } from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";

type Action =
  | { name: "Tab Active"; status: "online" | "visible" }
  | { name: "Tab Not Active" };

interface P extends Properties {}
interface PollingAnalytics extends Analytics<Action> {}

export const usePollingAnalytics = (): PollingAnalytics => {
  const userId = useGetUserQuery();

  const sendEvent: PollingAnalytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "Polling",
      userId,
    });
  };

  return { sendEvent };
};
