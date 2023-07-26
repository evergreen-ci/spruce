import { useState } from "react";
import Button from "@leafygreen-ui/button";
import { useVersionAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
import { ScheduleTasksModal } from "components/ScheduleTasksModal";

interface ScheduleTasksProps {
  versionId: string;
  isButton?: boolean;
  disabled?: boolean;
}
export const ScheduleTasks: React.VFC<ScheduleTasksProps> = ({
  disabled = false,
  isButton,
  versionId,
}) => {
  const [open, setOpen] = useState(false);
  const { sendEvent } = useVersionAnalytics(versionId);
  const props = {
    "data-cy": "schedule-patch",
    onClick: () => {
      sendEvent({ name: "Open Schedule Tasks Modal" });
      setOpen(true);
    },
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
