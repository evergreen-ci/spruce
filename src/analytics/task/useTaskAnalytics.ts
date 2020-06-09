import { PatchStatus } from "types/patch";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import get from "lodash/get";
import { GET_TASK_EVENT_DATA } from "analytics/task/query";
import { addPageAction, Properties, Analytics } from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";

type Action =
  | { name: "Filter Tests"; filterBy: string }
  | { name: "Reset" }
  | { name: "Abort" }
  | { name: "Set Priority"; priority: number }
  | { name: "Unschedule" }
  | { name: "Change Page Size" }
  | { name: "Change Tab"; tab: string }
  | { name: "Click Logs HTML Button" }
  | { name: "Click Logs Raw Button" }
  | { name: "Select Logs Type" }
  | { name: "Add Notification" }
  | { name: "Click Base Commit" }
  | { name: "Click Host Link" }
  | { name: "Click Spawn Host" };

interface P extends Properties {
  taskId: string;
  taskStatus: PatchStatus;
  failedTestCount: number;
}
interface TaskAnalytics extends Analytics<Action> {}

export const usePatchAnalytics = (): TaskAnalytics => {
  const userId = useGetUserQuery();
  const { id } = useParams<{ id: string }>();
  const { data: eventData } = useQuery(GET_TASK_EVENT_DATA, {
    variables: { id },
  });
  const taskStatus = get(eventData, "patch.status", undefined);
  const failedTestCount = get(eventData, "patch.failedTestCount", undefined);

  const sendEvent: TaskAnalytics["sendEvent"] = (action) => {
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
