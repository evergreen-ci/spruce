import React from "react";
import styled from "@emotion/styled/macro";
import { StyledRouterLink } from "components/styles";
import Tooltip from "@leafygreen-ui/tooltip";
import { uiColors } from "@leafygreen-ui/palette";

const { green, gray, yellow, red } = uiColors;

interface Props {
  id: string;
  name: string;
  status: string;
}

export const TaskSquare: React.FC<Props> = ({ id, name, status }) => {
  return (
    <StyledRouterLink to={`/task/${id}`} className="task-square">
      <Tooltip
        trigger={
          <Square color={mapVariantTaskStatusToColor[status] || gray.light1} />
        }
        variant="dark"
        className="task-square-tooltip"
      >
        {name}
      </Tooltip>
    </StyledRouterLink>
  );
};

enum TaskStatus {
  Inactive = "inactive",

  // TaskUnstarted is assigned to a display task after cleaning up one of
  // its execution tasks. This indicates that the display task is
  // pending a rerun
  Unstarted = "unstarted",

  // TaskUndispatched indicates either
  //  1. a task is not scheduled to run (when Task.Activated == false)
  //  2. a task is scheduled to run (when Task.Activated == true)
  Undispatched = "undispatched",

  // TaskStarted indicates a task is running on an agent
  Started = "started",

  // TaskDispatched indicates that an agent has received the task, but
  // the agent has not yet told Evergreen that it's running the task
  Dispatched = "dispatched",

  // The task statuses below indicate that a task has finished.
  Succeeded = "success",

  // These statuses indicate the types of failures that are stored in
  // Task.Status field, build TaskCache and TaskEndDetails.
  Failed = "failed",
  SystemFailed = "system-failed",
  TestTimedOut = "test-timed-out",
  SetupFailed = "setup-failed",

  StatusBlocked = "blocked",
  StatusPending = "pending"
}

const failureLavender = "#C2A5CF";
const failurePurple = "#840884";

// only used for build variant task squares
const mapVariantTaskStatusToColor = {
  [TaskStatus.Inactive]: gray.light1,
  [TaskStatus.Unstarted]: gray.light1,
  [TaskStatus.Undispatched]: gray.light1,
  [TaskStatus.Started]: yellow.base,
  [TaskStatus.Dispatched]: gray.light1,
  [TaskStatus.Succeeded]: green.base,
  [TaskStatus.Failed]: red.base,
  [TaskStatus.SystemFailed]: failurePurple,
  [TaskStatus.TestTimedOut]: failurePurple,
  [TaskStatus.SetupFailed]: failureLavender,
  [TaskStatus.StatusBlocked]: gray.dark1,
  [TaskStatus.StatusPending]: yellow.base
};

const Square = styled.div`
  height: 12px;
  width: 12px;
  background-color: ${(props: { color: string }) => props.color};
  margin-right: 1px;
  margin-bottom: 1px;
`;
