import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import { UpdateUserSettingsMutationVariables } from "gql/generated/types";

type Action =
  | { name: "Change Tab"; tab: string }
  | { name: "Save Profile Info"; params: UpdateUserSettingsMutationVariables }
  | { name: "Save Notifications"; params: UpdateUserSettingsMutationVariables }
  | { name: "Clear Subscriptions" }
  | { name: "CLI Download Link"; downloadName: string }
  | { name: "Download Auth File" }
  | { name: "Reset Key" }
  | { name: "Create new public key" }
  | { name: "Update public key" }
  | { name: "Delete public key" }
  | { name: "Opt into Spruce" }
  | { name: "Opt out of Spruce" }
  | { name: "Toggle polling"; value: "Enabled" | "Disabled" };

export const usePreferencesAnalytics = () =>
  useAnalyticsRoot<Action>("PreferencesPages");
