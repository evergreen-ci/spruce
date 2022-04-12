import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { PaginationAnalytics } from "components/HistoryTable/ColumnPaginationButtons";
import { HistoryTableTestSearchAnalytics } from "components/HistoryTable/HistoryTableTestSearch/HistoryTableTestSearch";
import { ProjectSelectAnalytics } from "components/projectSelect";

type pageType = "Commit chart" | "Task history" | "Variant history";
type Action =
  | {
      name: "Click task cell";
      taskStatus: string;
    }
  | ({ name: "Paginate" } & PaginationAnalytics)
  | ({ name: "Select project" } & ProjectSelectAnalytics)
  | ({
      name: "Submit failed test filter";
    } & HistoryTableTestSearchAnalytics)
  | { name: "Clear all badges" }
  | { name: "Click grouped task status badge"; statuses: string[] }
  | { name: "Click task status icon"; status: string }
  | {
      name: "Click commit label";
      link: "jira" | "githash";
      commitType: "active" | "inactive";
    }
  | { name: "Click variant label"; variant: string }
  | { name: "Select chart view option"; viewOption: string }
  | { name: "Click commit label jira link" }
  | { name: "Click commit label version link"; versionId: string }
  | { name: "Click task history column header"; variant: string }
  | { name: "Click variant history column header"; task: string }
  | { name: "Click variant history task selector"; tasks: string[] }
  | { name: "Filter commit chart by requester"; requesters: string[] }
  | { name: "Filter commit chart by task status"; statuses: string[] }
  | { name: "Toggle task icons legend"; toggle: "open" | "close" }
  | { name: "Remove commit chart badge" }
  | { name: "Remove task history badge" }
  | { name: "Remove variant history badge" }
  | {
      name: "Submit task history build variant selector";
      buildVariants: string[];
    }
  | { name: "Toggle folded commit"; toggle: "open" | "close" }
  | {
      name: "Toggle commit chart label tooltip";
    };

interface P extends Properties {}
interface Analytics extends A<Action> {}

export const useProjectHealthAnalytics: (p: {
  page: pageType;
}) => Analytics = ({ page }) => {
  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "ProjectHealthPages",
      page,
    });
  };

  return { sendEvent };
};
