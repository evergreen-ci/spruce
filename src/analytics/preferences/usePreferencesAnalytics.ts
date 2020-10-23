import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";
import { UpdateUserSettingsMutationVariables } from "gql/generated/types";

type Action =
  | { name: "Change Tab"; tab: string }
  | { name: "Save Profile Info"; params: UpdateUserSettingsMutationVariables }
  | { name: "Log Me Out Everywhere" }
  | { name: "Save Notifications"; params: UpdateUserSettingsMutationVariables }
  | { name: "Clear Subscriptions" }
  | { name: "CLI Download Link"; downloadName: string };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const usePreferencesAnalytics = (): Analytics => {
  const userId = useGetUserQuery();

  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "PreferencesPages",
      userId,
    });
  };

  return { sendEvent };
};
