import React from "react";
import styled from "@emotion/styled/macro";
import { StyledRouterLink } from "components/styles";
import Tooltip from "@leafygreen-ui/tooltip";
import { uiColors } from "@leafygreen-ui/palette";
import { TaskStatus } from "types/task";

const { green, gray, yellow, red } = uiColors;

interface Props {
  id: string;
  name: string;
  status: string;
}

export const TaskSquare: React.FC<Props> = ({ id, name, status }) => (
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
  [TaskStatus.StatusPending]: yellow.base,
};

const Square = styled.div`
  height: 12px;
  width: 12px;
  background-color: ${(props: { color: string }): string => props.color};
  margin-right: 1px;
  margin-bottom: 1px;
`;
