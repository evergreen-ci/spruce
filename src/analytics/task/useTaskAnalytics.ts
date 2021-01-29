import { useQuery } from "@apollo/client";
import get from "lodash/get";
import { useParams } from "react-router-dom";
import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { GET_TASK_EVENT_DATA } from "analytics/task/query";
import { useGetUserQuery } from "analytics/useGetUserQuery";

import {
  SaveSubscriptionMutationVariables,
  GetTaskEventDataQuery,
  GetTaskEventDataQueryVariables,
} from "gql/generated/types";
import { TaskStatus, LogTypes } from "types/task";

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
  | { name: "Click Logs HTML Button" }
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
  | { name: "Click Project Link" };

interface P extends Properties {
  taskId: string;
  taskStatus: TaskStatus;
  failedTestCount: number;
}
interface Analytics extends A<Action> {}

export const useTaskAnalytics = (): Analytics => {
  const userId = useGetUserQuery();
  const { id } = useParams<{ id: string }>();
  const { data: eventData } = useQuery<
    GetTaskEventDataQuery,
    GetTaskEventDataQueryVariables
  >(GET_TASK_EVENT_DATA, {
    variables: { taskId: id },
    fetchPolicy: "cache-first",
  });
  const taskStatus = get(eventData, "task.status", undefined);
  const failedTestCount = get(eventData, "task.failedTestCount", undefined);

  const sendEvent: Analytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: "Task",
      userId,
      taskStatus,
      taskId: id,
      failedTestCount,
    });
  };

  return { sendEvent };
};
