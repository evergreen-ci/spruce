import { Link } from "react-router-dom";
import { getTaskRoute } from "constants/routes";
import { PodEventsQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";
import { errorReporting } from "utils";

const { reportError } = errorReporting;

enum EventTypes {
  StatusChange = "STATUS_CHANGE",
  ContainerTaskFinished = "CONTAINER_TASK_FINISHED",
  ClearedTask = "CLEARED_TASK",
  AssignedTask = "ASSIGNED_TASK",
}

export const getEventCopy = (
  event: Unpacked<PodEventsQuery["pod"]["events"]["eventLogEntries"]>
) => {
  const { eventType, data } = event;
  const taskLink = (
    <Link to={getTaskRoute(data.taskID, { execution: data.taskExecution })}>
      {data.task?.displayName}
    </Link>
  );
  switch (eventType) {
    case EventTypes.StatusChange:
      return (
        <span>
          Container status changed from <b>{data?.oldStatus}</b> to{" "}
          <b>{data?.newStatus}</b>.
        </span>
      );
    case EventTypes.ContainerTaskFinished:
      return (
        <span>
          Task {taskLink} finished with status <b>{data?.taskStatus}</b>.
        </span>
      );
    case EventTypes.ClearedTask:
      return <span>Task {taskLink} cleared.</span>;
    case EventTypes.AssignedTask:
      return <span>Task {taskLink} assigned.</span>;
    default:
      reportError(
        new Error(`Unrecognized pod event type: ${eventType}`)
      ).severe();
      return null;
  }
};
