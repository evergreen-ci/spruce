import { TaskStatus } from "types/task";
import { CannotRun } from "./CannotRun";
import { Failed } from "./Failed";
import { KnownFailure } from "./KnownFailure";
import { Running } from "./Running";
import { SetupFailure } from "./SetupFailure";
import { Success } from "./Success";
import { SystemFailure } from "./SystemFailure";
import { TimedOut } from "./TimedOut";
import { WillNotRun } from "./WillNotRun";
import { WillRun } from "./WillRun";

interface TaskStatusIconProps {
  status: TaskStatus;
}

export const TaskStatusIcon: React.FC<TaskStatusIconProps> = ({ status }) => {
  switch (status) {
    case TaskStatus.Succeeded:
      return <Success />;
    case TaskStatus.Failed:
      return <Failed />;
    case TaskStatus.KnownIssue:
      return <KnownFailure />;
    case TaskStatus.Dispatched:
    case TaskStatus.Started:
      return <Running />;
    case TaskStatus.SetupFailed:
      return <SetupFailure />;
    case TaskStatus.SystemUnresponsive:
    case TaskStatus.SystemTimedOut:
    case TaskStatus.SystemFailed:
      return <SystemFailure />;
    case TaskStatus.TestTimedOut:
    case TaskStatus.TaskTimedOut:
      return <TimedOut />;
    case TaskStatus.Aborted:
    case TaskStatus.Blocked:
    case TaskStatus.Unscheduled:
      return <WillNotRun />;
    case TaskStatus.WillRun:
    case TaskStatus.Pending:
      return <WillRun />;
    case TaskStatus.Inactive:
      return <CannotRun />;
    case TaskStatus.Unstarted:
      return <>unstarted</>;
    default:
      return <>{status}</>;
  }
};
