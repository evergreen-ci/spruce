import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";
import { TupleAnalytics } from "components/TupleSelect";

type Action =
  | { name: "Click commit label version link"; versionId: string }
  | { name: "Click commit label jira link"; jiraTicket: string }
  | { name: "Click view option"; viewOption: string }
  | ({ name: "Submit Waterfall bv/task tuple" } & TupleAnalytics);

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
