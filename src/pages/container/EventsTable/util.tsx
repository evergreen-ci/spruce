import { Link } from "react-router-dom";
import { getTaskRoute } from "constants/routes";
import { PodEventsQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";

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
    case "STATUS_CHANGE":
      return (
        <span>
          Container status changed from {data?.oldStatus} to {data?.newStatus}.
        </span>
      );
    case "CONTAINER_TASK_FINISHED":
      return (
        <span>
          Task {taskLink} finished with status {data?.taskStatus}.
        </span>
      );
    case "CLEARED_TASK":
      return <span>Task {taskLink} cleared.</span>;
    case "ASSIGNED_TASK":
      return <span>Task {taskLink} assigned.</span>;
    default:
      return null;
  }
};
