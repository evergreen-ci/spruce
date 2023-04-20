import { addPageAction, Properties, Analytics } from "analytics/addPageAction";

type Action = { name: "Triggered Konami Code" };

interface P extends Properties {}
interface ActivityAnalytics extends Analytics<Action> {}

export const useAprilFoolsAnalytics = (): ActivityAnalytics => {
  const sendEvent: ActivityAnalytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "April Fools",
    });
  };

  return { sendEvent };
};
