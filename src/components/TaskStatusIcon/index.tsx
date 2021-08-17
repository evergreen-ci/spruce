import { uiColors } from "@leafygreen-ui/palette";
import Icon, { Size } from "components/Icon";
import { TaskStatus } from "types/task";
import { errorReporting } from "utils";

const { reportError } = errorReporting;
const { green, red, yellow, gray } = uiColors;

const failurePurple = "#36367F";
interface TaskStatusIconProps {
  status: TaskStatus;
  size?: Size | number;
}

export const TaskStatusIcon: React.FC<TaskStatusIconProps> = ({
  status,
  size = Size.Default,
}) => {
  switch (status) {
    case TaskStatus.Succeeded:
      return <Icon glyph="Checkmark" fill={green.base} size={size} />;
    case TaskStatus.Failed:
      return <Icon glyph="X" fill={red.base} size={size} />;
    case TaskStatus.KnownIssue:
      return <Icon glyph="KnownFailureIcon" fill={red.base} size={size} />;
    case TaskStatus.Dispatched:
    case TaskStatus.Started:
      return <Icon glyph="Refresh" fill={yellow.dark2} size={size} />;
    case TaskStatus.SetupFailed:
      return <Icon glyph="SetupFailure" fill={red.base} size={size} />;
    case TaskStatus.SystemUnresponsive:
    case TaskStatus.SystemTimedOut:
    case TaskStatus.SystemFailed:
      return <Icon glyph="SystemFailure" fill={failurePurple} size={size} />;
    case TaskStatus.TestTimedOut:
    case TaskStatus.TaskTimedOut:
      return <Icon glyph="TimedOut" fill={red.base} size={size} />;
    case TaskStatus.Aborted:
    case TaskStatus.Blocked:
    case TaskStatus.Unscheduled:
      return <Icon glyph="WillNotRun" fill={gray.dark1} size={size} />;
    case TaskStatus.WillRun:
    case TaskStatus.Pending:
      return <Icon glyph="Calendar" fill={gray.dark3} size={size} />;
    default:
      reportError(
        new Error(`Status '${status}' is not a valid task status`)
      ).warning();
      return <></>;
  }
};
