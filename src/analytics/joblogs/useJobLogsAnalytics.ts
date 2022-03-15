import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";

type Action =
  | { name: "Clicked lobster testlog url"; testId: string }
  | { name: "Clicked HTML testlog url"; testId: string }
  | { name: "Clicked complete logs link"; taskId: string };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useJobLogsAnalytics = (): Analytics => {
  const userId = useGetUserQuery();

  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "JobLogs",
      userId,
    });
  };

  return { sendEvent };
};
