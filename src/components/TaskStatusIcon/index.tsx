import { uiColors } from "@leafygreen-ui/palette";
import Icon, { Size } from "components/Icon";
import { TaskStatus } from "types/task";
import { errorReporting } from "utils";

const { reportError } = errorReporting;
const { green, red, yellow, gray } = uiColors;

const failurePurple = "#36367F";
interface TaskStatusIconProps {
  status: string;
  size?: Size | number;
  style?: React.CSSProperties;
}

export const TaskStatusIcon: React.FC<TaskStatusIconProps> = ({
  status,
  size = Size.Default,
  style,
}) => {
  const props = {
    size,
    style,
  };
  switch (status) {
    case TaskStatus.Succeeded:
      return <Icon glyph="Checkmark" fill={green.base} {...props} />;
    case TaskStatus.Failed:
      return <Icon glyph="X" fill={red.base} {...props} />;
    case TaskStatus.KnownIssue:
      return <Icon glyph="KnownFailureIcon" fill={red.base} {...props} />;
    case TaskStatus.Dispatched:
    case TaskStatus.Started:
      return <Icon glyph="Refresh" fill={yellow.dark2} {...props} />;
    case TaskStatus.SetupFailed:
      return <Icon glyph="SetupFailure" fill={red.base} {...props} />;
    case TaskStatus.SystemUnresponsive:
    case TaskStatus.SystemTimedOut:
    case TaskStatus.SystemFailed:
      return <Icon glyph="SystemFailure" fill={failurePurple} {...props} />;
    case TaskStatus.TestTimedOut:
    case TaskStatus.TaskTimedOut:
      return <Icon glyph="TimedOut" fill={red.base} {...props} />;
    case TaskStatus.Aborted:
    case TaskStatus.Blocked:
    case TaskStatus.Unscheduled:
      return <Icon glyph="WillNotRun" fill={gray.dark1} {...props} />;
    case TaskStatus.WillRun:
    case TaskStatus.Pending:
    case TaskStatus.Unstarted:
      return <Icon glyph="Calendar" fill={gray.dark3} {...props} />;
    default:
      reportError(
        new Error(`Status '${status}' is not a valid task status`)
      ).warning();
      return <></>;
  }
};
