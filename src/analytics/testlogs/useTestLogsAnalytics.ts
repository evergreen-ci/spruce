import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";

type Action = { name: "Clicked lobster testlog url"; testId: string };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useTestLogsAnalytics = (): Analytics => {
  const userId = useGetUserQuery();

  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "TestLogs",
      userId,
    });
  };

  return { sendEvent };
};
