import { useCallback, useMemo } from "react";
import {
  ActionType,
  Analytics,
  AnalyticsObject,
  Properties,
  addPageAction,
} from "analytics/addPageAction";

interface P extends Properties {}

export const useAnalyticsRoot = <Action extends ActionType>(
  object: AnalyticsObject,
  attributes: { [key: string]: any } = {},
): Analytics<Action> => {
  const sendEvent: Analytics<Action>["sendEvent"] = useCallback(
    (action) => {
      const userId = localStorage.getItem("userId");
      addPageAction<Action, P>(action, {
        object,
        userId,
        ...attributes,
      });
    },
    [object, attributes],
  );

  return useMemo(() => ({ sendEvent }), [sendEvent]);
};
