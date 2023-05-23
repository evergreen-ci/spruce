import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { getTaskRoute } from "constants/routes";
import { PodEventsQuery } from "gql/generated/types";
import { PodEvent } from "types/pod";
import { Unpacked } from "types/utils";
import { errorReporting } from "utils";

const { reportError } = errorReporting;

export const getEventCopy = (
  event: Unpacked<PodEventsQuery["pod"]["events"]["eventLogEntries"]>
) => {
  const { eventType, data } = event;
  const taskLink = (
    <LinkWrapper>
      <StyledLink
        title={data.taskID}
        to={getTaskRoute(data.taskID, { execution: data.taskExecution })}
      >
        {data.taskID}
      </StyledLink>
    </LinkWrapper>
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

const LinkWrapper = styled.span`
  position: relative;
  top: 6px;
`;
const StyledLink = styled(Link)`
  max-width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
`;
