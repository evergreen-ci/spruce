import { IconProps } from "@leafygreen-ui/icon";
import { palette } from "@leafygreen-ui/palette";
import Icon from "components/Icon";
import { TaskStatus } from "types/task";
import { reportError } from "utils/errorReporting";

const { gray, green, purple, red, yellow } = palette;

export interface TaskStatusIconProps
  extends Omit<IconProps, "glyph" | "fill" | "size"> {
  status: string;
  size?: number;
}

export const TaskStatusIcon: React.FC<TaskStatusIconProps> = ({
  size = 16,
  status,
  ...rest
}) => {
  switch (status) {
    case TaskStatus.Succeeded:
      return (
        <Icon glyph="Checkmark" fill={green.dark1} size={size} {...rest} />
      );
    case TaskStatus.Failed:
      return <Icon glyph="FailureIcon" fill={red.base} size={size} {...rest} />;
    case TaskStatus.KnownIssue:
      return (
        <Icon glyph="KnownFailureIcon" fill={red.base} size={size} {...rest} />
      );
    case TaskStatus.Dispatched:
    case TaskStatus.Started:
      return <Icon glyph="Refresh" fill={yellow.dark2} size={size} {...rest} />;
    case TaskStatus.SetupFailed:
      return (
        <Icon glyph="SetupFailure" fill={purple.dark2} size={size} {...rest} />
      );
    case TaskStatus.SystemUnresponsive:
    case TaskStatus.SystemTimedOut:
    case TaskStatus.SystemFailed:
      return (
        <Icon glyph="SystemFailure" fill={purple.dark2} size={size} {...rest} />
      );
    case TaskStatus.TestTimedOut:
    case TaskStatus.TaskTimedOut:
      return <Icon glyph="TimedOut" fill={red.base} size={size} {...rest} />;
    case TaskStatus.Aborted:
    case TaskStatus.Blocked:
    case TaskStatus.Unscheduled:
    case TaskStatus.Inactive:
    case TaskStatus.Undispatched:
      return (
        <Icon glyph="WillNotRun" fill={gray.dark1} size={size} {...rest} />
      );
    case TaskStatus.WillRun:
    case TaskStatus.Pending:
    case TaskStatus.Unstarted:
      return <Icon glyph="Calendar" fill={gray.dark3} size={size} {...rest} />;
    default:
      reportError(
        new Error(`Status '${status}' is not a valid task status`),
      ).warning();
      return null;
  }
};

export const groupedIconStatuses = [
  {
    icon: <TaskStatusIcon status={TaskStatus.Succeeded} />,
    statuses: [TaskStatus.Succeeded],
  },
  {
    icon: <TaskStatusIcon status={TaskStatus.Failed} />,
    statuses: [TaskStatus.Failed],
  },

  {
    icon: <TaskStatusIcon status={TaskStatus.KnownIssue} />,
    statuses: [TaskStatus.KnownIssue],
  },

  {
    icon: <TaskStatusIcon status={TaskStatus.SetupFailed} />,
    statuses: [TaskStatus.SetupFailed],
  },
  {
    icon: <TaskStatusIcon status={TaskStatus.TestTimedOut} />,
    statuses: [TaskStatus.TestTimedOut, TaskStatus.TaskTimedOut],
  },
  {
    icon: <TaskStatusIcon status={TaskStatus.Dispatched} />,
    statuses: [TaskStatus.Dispatched, TaskStatus.Started],
  },
  {
    icon: <TaskStatusIcon status={TaskStatus.WillRun} />,
    statuses: [TaskStatus.WillRun, TaskStatus.Pending, TaskStatus.Unstarted],
  },
  {
    icon: <TaskStatusIcon status={TaskStatus.SystemUnresponsive} />,
    statuses: [
      TaskStatus.SystemUnresponsive,
      TaskStatus.SystemTimedOut,
      TaskStatus.SystemFailed,
    ],
  },
  {
    icon: <TaskStatusIcon status={TaskStatus.Aborted} />,
    statuses: [
      TaskStatus.Aborted,
      TaskStatus.Blocked,
      TaskStatus.Unscheduled,
      TaskStatus.Inactive,
      TaskStatus.Undispatched,
    ],
  },
];
