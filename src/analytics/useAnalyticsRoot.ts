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
  object: AnalyticsObject
): Analytics<Action> => {
  const sendEvent: Analytics<Action>["sendEvent"] = useCallback(
    (action) => {
      addPageAction<Action, P>(action, { object });
    },
    [object]
  );

  return useMemo(() => ({ sendEvent }), [sendEvent]);
};
