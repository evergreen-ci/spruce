import { useState } from "react";
import { useVersionAnalytics } from "analytics";
import { Button } from "components/Button";
import { DropdownItem } from "components/ButtonDropdown";
import { ScheduleTasksModal } from "components/ScheduleTasksModal";

interface ScheduleTasksProps {
  versionId: string;
  isButton?: boolean;
  disabled?: boolean;
}
export const ScheduleTasks: React.FC<ScheduleTasksProps> = ({
  versionId,
  isButton,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const { sendEvent } = useVersionAnalytics(versionId);
  const props = {
    onClick: () => {
      sendEvent({ name: "Open Schedule Tasks Modal" });
      setOpen(true);
    },
    "data-cy": "schedule-patch",
  };

  const modalOpenerComp = isButton ? (
    <Button size="small" disabled={disabled} {...props}>
      Schedule
    </Button>
  ) : (
    <DropdownItem disabled={disabled} {...props}>
      Schedule
    </DropdownItem>
  );
  return (
    <>
      {modalOpenerComp}
      <ScheduleTasksModal open={open} setOpen={setOpen} versionId={versionId} />
    </>
  );
};
