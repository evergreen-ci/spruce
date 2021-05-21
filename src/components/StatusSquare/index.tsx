import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { TaskStatus } from "types/task";

const { green, gray, yellow, red } = uiColors;

const failureLavender = "#F3EDF5";
const failureLavendarDark = "#9982A4";
const failurePurple = "#E6CCE6";
const failurePurpleDark = "#620662";

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
  [TaskStatus.Aborted]: gray.light1,
  [TaskStatus.StatusPending]: yellow.base,
  [TaskStatus.Known]: red.base,
};

export const mapVariantTaskStatusToDarkColor = {
  [TaskStatus.Inactive]: gray.dark3,
  [TaskStatus.Unstarted]: gray.dark3,
  [TaskStatus.Undispatched]: gray.dark3,
  [TaskStatus.Started]: yellow.dark3,
  [TaskStatus.Dispatched]: gray.dark3,
  [TaskStatus.Succeeded]: green.dark3,
  [TaskStatus.Failed]: red.dark3,
  [TaskStatus.TestTimedOut]: red.dark3,
  [TaskStatus.TaskTimedOut]: red.dark3,
  [TaskStatus.SystemFailed]: failurePurpleDark,
  [TaskStatus.SystemTimedOut]: failurePurpleDark,
  [TaskStatus.SystemUnresponsive]: failurePurpleDark,
  [TaskStatus.SetupFailed]: failureLavendarDark,
  [TaskStatus.StatusBlocked]: gray.dark3,
  [TaskStatus.StatusPending]: yellow.dark3,
  [TaskStatus.Known]: red.dark3,
  [TaskStatus.Aborted]: gray.dark3,
};

export const Square = styled.div`
  height: 12px;
  width: 12px;
  background-color: ${(props: { color: string }): string =>
    props.color ? props.color : gray.light1};
  margin-right: 1px;
  margin-bottom: 1px;
`;
