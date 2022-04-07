import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";

type Action = { name: "Submit tuple select"; type: string; value: string };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useTupleSelectAnalytics = (): Analytics => {
  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "TupleSelect",
    });
  };

  return { sendEvent };
};
