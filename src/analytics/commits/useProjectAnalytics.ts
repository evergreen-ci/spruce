import { useParams } from "react-router-dom";
import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";

type Action = { name: "Filter Tasks"; filterBy: string };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useProjectAnalytics = (): Analytics => {
  const { id: projectId } = useParams<{ id: string }>();
  const userId = useGetUserQuery();
  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "Project",
      userId,
      projectId,
    });
  };

  return { sendEvent };
};
