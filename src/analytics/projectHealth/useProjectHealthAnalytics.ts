import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";
import { HistoryTableTestSearchAnalytics } from "components/HistoryTable/HistoryTableTestSearch/HistoryTableTestSearch";
import { ProjectSelectAnalytics } from "components/projectSelect";
import { TupleAnalytics } from "components/TupleSelect";

type Action =
  | { name: "Click commit label version link"; versionId: string }
  | { name: "Click commit label jira link"; jiraTicket: string }
  | { name: "Click commit chart view option"; viewOption: string }
  | ({ name: "Submit commit chart variant/task tuple" } & TupleAnalytics)
  | { name: "Filter commit chart by task status"; statuses: string[] }
  | { name: "Filter commit chart by requester"; requesters: string[] }
  | ({ name: "Select commit chart project" } & ProjectSelectAnalytics)
  | { name: "Click commit chart grouped status badge"; statuses: string[] }
  | { name: "Click commit chart task status icon"; status: string }
  | ({
      name: "Submit variant history failed test filter";
    } & HistoryTableTestSearchAnalytics)
  | ({
      name: "Submit task history failed test filter";
    } & HistoryTableTestSearchAnalytics)
  | { name: "Remove commit chart badge" }
  | { name: "Clear all commit chart badges" }
  | { name: "Remove task history badge" }
  | { name: "Clear all task history badges" }
  | { name: "Remove variant history badge" }
  | { name: "Clear all variant history badges" }
  | { name: "Click variant history task selector"; tasks: string[] }
  | { name: "Click variant history column header"; task: string }
  | { name: "Click task history column header"; variant: string }
  | {
      name: "Submit task history build variant selector";
      buildVariants: string[];
    };
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
