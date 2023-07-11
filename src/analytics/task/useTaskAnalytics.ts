import { useQuery } from "@apollo/client";
import { useParams, useLocation } from "react-router-dom";
import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";
import {
  SaveSubscriptionForUserMutationVariables,
  TaskQuery,
  TaskQueryVariables,
  TaskSortCategory,
  TestSortCategory,
} from "gql/generated/types";
import { GET_TASK } from "gql/queries";
import { CommitType } from "pages/task/actionButtons/previousCommits/types";
import { RequiredQueryParams, LogTypes } from "types/task";
import { queryString } from "utils";

const { parseQueryString } = queryString;

type LogViewer = "raw" | "html" | "parsley" | "lobster";
type Action =
  | { name: "Filter Tests"; filterBy: string }
  | {
      name: "Sort Tests Table";
      sortBy:
        | TestSortCategory.TestName
        | TestSortCategory.Status
        | TestSortCategory.BaseStatus
        | TestSortCategory.Duration;
    }
  | {
      name: "Sort Execution Tasks Table";
      sortBy:
        | TaskSortCategory.Name
        | TaskSortCategory.Status
        | TaskSortCategory.BaseStatus
        | TaskSortCategory.Variant;
    }
  | { name: "Restart" }
  | { name: "Schedule" }
  | { name: "Abort" }
  | { name: "Set Priority"; priority: number }
  | { name: "Unschedule" }
  | { name: "Change Page Size" }
  | { name: "Change Tab"; tab: string }
  | { name: "Change Execution" }
  | { name: "Click Logs Button"; logType: LogTypes; logViewer: LogViewer }
  | { name: "Click Test Logs Button"; logViewer: LogViewer; testStatus: string }
  | { name: "Click Annotation Link"; linkText: string }
  | { name: "Select Logs Type"; logType: LogTypes }
  | { name: "Open Notification Modal" }
  | {
      name: "Add Notification";
      subscription: SaveSubscriptionForUserMutationVariables["subscription"];
    }
  | { name: "Click Base Commit" }
  | { name: "Click Host Link" }
  | { name: "Click Pod Link" }
  | { name: "Click Spawn Host" }
  | { name: "Click Distro Link" }
  | { name: "Click Build Variant Link" }
  | { name: "Click Execution Task Link" }
  | { name: "Click Display Task Link" }
  | { name: "Click Project Link" }
  | { name: "Click See History Button" }
  | { name: "Click Trace Link" }
  | { name: "Click Trace Metrics Link" }
  | { name: "Submit Previous Commit Selector"; type: CommitType };

interface P extends Properties {
  taskId: string;
  taskStatus: string;
  failedTestCount: number;
  execution: number;
  isLatestExecution: string;
}
export interface Analytics extends A<Action> {}

export const useTaskAnalytics = (): Analytics => {
  const userId = useGetUserQuery();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const parsed = parseQueryString(location.search);
  const execution = Number(parsed[RequiredQueryParams.Execution]);
  const { data: eventData } = useQuery<TaskQuery, TaskQueryVariables>(
    GET_TASK,
    {
      variables: { taskId: id, execution },
      fetchPolicy: "cache-first",
    }
  );

  const {
    status: taskStatus,
    failedTestCount,
    latestExecution,
  } = eventData?.task || {};
  const isLatestExecution = latestExecution === execution;
  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "Task",
      userId,
      taskStatus,
      execution,
      isLatestExecution: isLatestExecution.toString(),
      taskId: id,
      failedTestCount,
    });
  };

  return { sendEvent };
};
