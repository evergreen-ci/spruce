import { ShortenedRouterLink } from "components/styles";
import { getTaskRoute } from "constants/routes";
import { PodEventsQuery } from "gql/generated/types";
import { PodEvent } from "types/pod";
import { Unpacked } from "types/utils";
import { reportError } from "utils/errorReporting";

interface EventCopyProps {
  event: Unpacked<PodEventsQuery["pod"]["events"]["eventLogEntries"]>;
}
export const EventCopy: React.FC<EventCopyProps> = ({ event }) => {
  const { data, eventType } = event;
  const taskLink = (
    <ShortenedRouterLink
      title={data.taskID}
      to={getTaskRoute(data.taskID, { execution: data.taskExecution })}
    >
      {data.taskID}
    </ShortenedRouterLink>
  );
  switch (eventType) {
    case PodEvent.StatusChange:
      return (
        <span>
          Container status changed from <b>{data?.oldStatus}</b> to{" "}
          <b>{data?.newStatus}</b>.
        </span>
      );
    case PodEvent.ContainerTaskFinished:
      return (
        <span>
          Task {taskLink} finished with status <b>{data?.taskStatus}</b>.
        </span>
      );
    case PodEvent.ClearedTask:
      return <span>Task {taskLink} cleared.</span>;
    case PodEvent.AssignedTask:
      return <span>Task {taskLink} assigned.</span>;
    default:
      reportError(
        new Error(`Unrecognized pod event type: ${eventType}`)
      ).severe();
      return null;
  }
};
