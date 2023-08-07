import { useState } from "react";
import Button from "@leafygreen-ui/button";
import { useVersionAnalytics } from "analytics";
import { PatchNotificationModal } from "./addNotification/PatchNotificationModal";

interface Props {
  patchId: string;
  setParentLoading?: (loading: boolean) => void; // used to toggle loading state of parent
}

export const AddNotification: React.FC<Props> = ({ patchId }) => {
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const { sendEvent } = useVersionAnalytics(patchId);

  return (
    <>
      <Button
        size="small"
        data-cy="notify-patch"
        onClick={() => {
          sendEvent({ name: "Open Notification Modal" });
          setIsVisibleModal(true);
        }}
      >
        Notify me
      </Button>
      <PatchNotificationModal
        visible={isVisibleModal}
        onCancel={() => setIsVisibleModal(false)}
      />
    </>
  );
};
