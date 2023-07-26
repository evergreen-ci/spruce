import { useParams } from "react-router-dom";
import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";

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
  const { projectIdentifier } = useParams<{ projectIdentifier: string }>();

  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      identifier: projectIdentifier,
      object: "ProjectSettings",
    });
  };

  return { sendEvent };
};
