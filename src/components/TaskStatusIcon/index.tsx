import { uiColors } from "@leafygreen-ui/palette";
import Icon from "components/Icon";
import { TaskStatus } from "types/task";

const { green, red, yellow, gray } = uiColors;

interface TaskStatusIconProps {
  status: TaskStatus;
}

export const TaskStatusIcon: React.FC<TaskStatusIconProps> = ({ status }) => {
  switch (status) {
    case TaskStatus.Succeeded:
      return <Icon glyph="Checkmark" fill={green.base} size={30} />;
    case TaskStatus.Failed:
      return <Icon glyph="X" fill={red.base} size={30} />;
    case TaskStatus.KnownIssue:
      return <Icon glyph="KnownFailureIcon" fill={red.base} size={30} />;
    case TaskStatus.Dispatched:
    case TaskStatus.Started:
      return <Icon glyph="Refresh" fill={yellow.dark2} size={30} />;
    case TaskStatus.SetupFailed:
      return <Icon glyph="SetupFailure" size={30} />;
    case TaskStatus.SystemUnresponsive:
    case TaskStatus.SystemTimedOut:
    case TaskStatus.SystemFailed:
      return <Icon glyph="SystemFailure" size={30} />;
    case TaskStatus.TestTimedOut:
    case TaskStatus.TaskTimedOut:
      return <Icon glyph="TimedOut" size={30} />;
    case TaskStatus.Aborted:
    case TaskStatus.Blocked:
    case TaskStatus.Unscheduled:
      return <Icon glyph="WillNotRun" size={30} />;
    case TaskStatus.WillRun:
    case TaskStatus.Pending:
      return <Icon glyph="Calendar" fill={gray.dark3} size={30} />;
    default:
      return <>{status}</>;
  }
};
