import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";
import { ProjectSelectAnalytics } from "components/projectSelect";
import { TupleAnalytics } from "components/TupleSelect";

type Action =
  | { name: "Click commit label version link"; versionId: string }
  | { name: "Click commit label jira link"; jiraTicket: string }
  | { name: "Click commit chart view option"; viewOption: string }
  | ({ name: "Submit commit chart bv/task tuple" } & TupleAnalytics)
  | { name: "Filter commit chart by task status"; statuses: string[] }
  | { name: "Filter commit chart by requester"; requesters: string[] }
  | ({ name: "Select commit chart project" } & ProjectSelectAnalytics)
  | { name: "Click commit chart grouped status badge"; statuses: string[] }
  | { name: "Click commit chart task status icon"; status: string };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useProjectHealthAnalytics = (): Analytics => {
  const userId = useGetUserQuery();
  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "ProjectHealthPages",
      userId,
    });
  };

  return { sendEvent };
};
