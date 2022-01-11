import { uiColors } from "@leafygreen-ui/palette";
import Icon from "components/Icon";
import { TaskStatus } from "types/task";
import { errorReporting } from "utils";

const { reportError } = errorReporting;
const { green, red, yellow, gray } = uiColors;

const failurePurple = "#36367F";

type IconProps = React.ComponentProps<typeof Icon>;
interface TaskStatusIconProps
  extends Omit<IconProps, "glyph" | "fill" | "size"> {
  status: string;
  size?: number;
}

export const TaskStatusIcon: React.FC<TaskStatusIconProps> = ({
  status,
  size = 16,
  ...rest
}) => {
  switch (status) {
    case TaskStatus.Succeeded:
      return <Icon glyph="Checkmark" fill={green.base} size={size} {...rest} />;
    case TaskStatus.Failed:
      return <Icon glyph="X" fill={red.base} size={size} {...rest} />;
    case TaskStatus.KnownIssue:
      return (
        <Icon glyph="KnownFailureIcon" fill={red.base} size={size} {...rest} />
      );
    case TaskStatus.Dispatched:
    case TaskStatus.Started:
      return <Icon glyph="Refresh" fill={yellow.dark2} size={size} {...rest} />;
    case TaskStatus.SetupFailed:
      return (
        <Icon glyph="SetupFailure" fill={failurePurple} size={size} {...rest} />
      );
    case TaskStatus.SystemUnresponsive:
    case TaskStatus.SystemTimedOut:
    case TaskStatus.SystemFailed:
      return (
        <Icon
          glyph="SystemFailure"
          fill={failurePurple}
          size={size}
          {...rest}
        />
      );
    case TaskStatus.TestTimedOut:
    case TaskStatus.TaskTimedOut:
      return <Icon glyph="TimedOut" fill={red.base} size={size} {...rest} />;
    case TaskStatus.Aborted:
    case TaskStatus.Blocked:
    case TaskStatus.Unscheduled:
      return (
        <Icon glyph="WillNotRun" fill={gray.dark1} size={size} {...rest} />
      );
    case TaskStatus.WillRun:
    case TaskStatus.Pending:
    case TaskStatus.Unstarted:
      return <Icon glyph="Calendar" fill={gray.dark3} size={size} {...rest} />;
    default:
      reportError(
        new Error(`Status '${status}' is not a valid task status`)
      ).warning();
      return <></>;
  }
};
