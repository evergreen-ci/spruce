import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";

type Action = { name: "Click Link"; link: "myPatches" | "patch" };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useBreadcrumbAnalytics = (): Analytics => {
  const userId = useGetUserQuery();

  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "Breadcrumb",
      userId,
    });
  };

  return { sendEvent };
};
