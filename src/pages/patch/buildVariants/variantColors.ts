import { uiColors } from "@leafygreen-ui/palette";
import styled from "@emotion/styled/macro";
import { TaskStatus } from "types/task";

const { green, gray, yellow, red } = uiColors;

const failureLavender = "#C2A5CF";
const failurePurple = "#840884";

// only used for build variant task squares
export const mapVariantTaskStatusToColor = {
  [TaskStatus.Inactive]: gray.light1,
  [TaskStatus.Unstarted]: gray.light1,
  [TaskStatus.Undispatched]: gray.light1,
  [TaskStatus.Started]: yellow.base,
  [TaskStatus.Dispatched]: gray.light1,
  [TaskStatus.Succeeded]: green.base,
  [TaskStatus.Failed]: red.base,
  [TaskStatus.TestTimedOut]: red.base,
  [TaskStatus.TaskTimedOut]: red.base,
  [TaskStatus.SystemFailed]: failurePurple,
  [TaskStatus.SystemTimedOut]: failurePurple,
  [TaskStatus.SystemUnresponsive]: failurePurple,
  [TaskStatus.SetupFailed]: failureLavender,
  [TaskStatus.StatusBlocked]: gray.dark1,
  [TaskStatus.StatusPending]: yellow.base,
};

export const Square = styled.div`
  height: 12px;
  width: 12px;
  background-color: ${(props: { color: string }): string =>
    props.color ? props.color : gray.light1};
  margin-right: 1px;
  margin-bottom: 1px;
`;
