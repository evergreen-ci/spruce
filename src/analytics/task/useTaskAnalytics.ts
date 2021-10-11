import { useQuery } from "@apollo/client";
import { useParams, useLocation } from "react-router-dom";
import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";
import {
  SaveSubscriptionMutationVariables,
  GetTaskQuery,
  GetTaskQueryVariables,
} from "gql/generated/types";
import { GET_TASK } from "gql/queries";
import { RequiredQueryParams, LogTypes } from "types/task";
import { queryString } from "utils";

const { parseQueryString } = queryString;
type Action =
  | { name: "Filter Tests"; filterBy: string }
  | { name: "Restart" }
  | { name: "Schedule" }
  | { name: "Abort" }
  | { name: "Set Priority"; priority: number }
  | { name: "Unschedule" }
  | { name: "Change Page Size" }
  | { name: "Change Tab"; tab: string }
  | { name: "Change Execution" }
  | { name: "Click Logs Lobster Button" }
  | { name: "Click Logs HTML Button" }
  | { name: "Click Logs Lobster Button" }
  | { name: "Click Logs Raw Button" }
  | { name: "Select Logs Type"; logsType: LogTypes }
  | { name: "Open Notification Modal" }
  | {
      name: "Add Notification";
      subscription: SaveSubscriptionMutationVariables["subscription"];
    }
  | { name: "Click Base Commit" }
  | { name: "Click Host Link" }
  | { name: "Click Spawn Host" }
  | { name: "Click Distro Link" }
  | { name: "Click Build Variant Link" }
  | { name: "Click Execution Task Link" }
  | { name: "Click Display Task Link" }
  | { name: "Click Project Link" }
  | { name: "Click See History Button" };

interface P extends Properties {
  taskId: string;
  taskStatus: string;
  failedTestCount: number;
  execution: number;
  isLatestExecution: string;
}
interface Analytics extends A<Action> {}

export const useTaskAnalytics = (): Analytics => {
  const userId = useGetUserQuery();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const parsed = parseQueryString(location.search);
  const execution = Number(parsed[RequiredQueryParams.Execution]);
  const { data: eventData } = useQuery<GetTaskQuery, GetTaskQueryVariables>(
    GET_TASK,
    {
      variables: { taskId: id, execution },
      fetchPolicy: "cache-first",
    }
  );

  const { status: taskStatus, failedTestCount, latestExecution } =
    eventData?.task || {};
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
