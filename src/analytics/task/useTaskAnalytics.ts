import { TaskStatus } from "types/task";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import get from "lodash/get";
import { GET_TASK_EVENT_DATA } from "analytics/task/query";
import {
  addPageAction,
  Properties,
  Analytics as A,
} from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";
import { LogTypes } from "types/task";
import { SaveSubscriptionMutationVariables } from "gql/generated/types";

type Action =
  | { name: "Filter Tests"; filterBy: string }
  | { name: "Restart" }
  | { name: "Schedule" }
  | { name: "Abort" }
  | { name: "Set Priority"; priority: number }
  | { name: "Unschedule" }
  | { name: "Change Page Size" }
  | { name: "Change Tab"; tab: string }
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
  | { name: "Click Spawn Host" };

interface P extends Properties {
  taskId: string;
  taskStatus: TaskStatus;
  failedTestCount: number;
}
interface Analytics extends A<Action> {}

export const useTaskAnalytics = (): Analytics => {
  const userId = useGetUserQuery();
  const { id } = useParams<{ id: string }>();
  const { data: eventData } = useQuery(GET_TASK_EVENT_DATA, {
    variables: { id },
  });
  const taskStatus = get(eventData, "patch.status", undefined);
  const failedTestCount = get(eventData, "patch.failedTestCount", undefined);

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
