import { useState } from "react";
import { usePatchAnalytics } from "analytics";
import { Button } from "components/Button";
import { ScheduleTasksModal } from "components/ScheduleTasksModal";

interface ScheduleTasksProps {
  versionId: string;
}
export const ScheduleTasks: React.FC<ScheduleTasksProps> = ({ versionId }) => {
  const [open, setOpen] = useState(false);
  const patchAnalytics = usePatchAnalytics();
  return (
    <>
      <Button
        size="small"
        data-cy="schedule-tasks-button"
        onClick={() => {
          patchAnalytics.sendEvent({ name: "Open Schedule Tasks Modal" });
          setOpen(true);
        }}
      >
        Schedule Tasks
      </Button>
      <ScheduleTasksModal open={open} setOpen={setOpen} versionId={versionId} />
    </>
  );
};
