import { useParams } from "react-router-dom";
import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";

type Action =
  | { name: "Save project"; section: string }
  | { name: "Save repo"; section: string }
  | { name: "Default section to repo"; section: string }
  | { name: "Attach project to repo"; repoOwner: string; repoName: string }
  | { name: "Detach project from repo"; repoOwner: string; repoName: string }
  | { name: "Move project to new repo"; repoOwner: string; repoName: string }
  | { name: "Create new project" }
  | { name: "Duplicate project"; projectIdToCopy: string };

interface P extends Properties {
  identifier: string;
}

export interface Analytics extends A<Action> {}

export const useProjectSettingsAnalytics = (): Analytics => {
  const userId = useGetUserQuery();
  const { identifier } = useParams<{ identifier: string }>();

  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "ProjectSettings",
      userId,
      identifier,
    });
  };

  return { sendEvent };
};
