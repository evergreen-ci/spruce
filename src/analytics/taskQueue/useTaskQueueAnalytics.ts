import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";

type Action =
  | { name: "Select Distro"; distro: string }
  | { name: "Click Task Link" }
  | { name: "Click Version Link" }
  | { name: "Click Author Patches Link" };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useTaskQueueAnalytics = (): Analytics => {
  const userId = useGetUserQuery();

  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "TaskQueue",
      userId,
    });
  };

  return { sendEvent };
};
