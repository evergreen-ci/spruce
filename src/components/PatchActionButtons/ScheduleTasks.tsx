import { useState } from "react";
import { usePatchAnalytics } from "analytics";
import { Button } from "components/Button";
import { DropdownItem } from "components/ButtonDropdown";
import { ScheduleTasksModal } from "components/ScheduleTasksModal";

interface ScheduleTasksProps {
  versionId: string;
  isButton?: boolean;
}
export const ScheduleTasks: React.FC<ScheduleTasksProps> = ({
  versionId,
  isButton,
}) => {
  const [open, setOpen] = useState(false);
  const patchAnalytics = usePatchAnalytics();
  const props = {
    onClick: () => {
      patchAnalytics.sendEvent({ name: "Open Schedule Tasks Modal" });
      setOpen(true);
    },
    "data-cy": "schedule-patch",
  };

  const modalOpenerComp = isButton ? (
    <Button size="small" {...props}>
      Schedule
    </Button>
  ) : (
    <DropdownItem {...props}>Schedule</DropdownItem>
  );
  return (
    <>
      {modalOpenerComp}
      <ScheduleTasksModal open={open} setOpen={setOpen} versionId={versionId} />
    </>
  );
};
