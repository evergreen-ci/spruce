import React, { useState } from "react";
import { usePatchAnalytics, useVersionAnalytics } from "analytics";
import { Button } from "components/Button";
import { PatchNotificationModal } from "./addNotification/PatchNotificationModal";

interface Props {
  patchId: string;
  refetchQueries: string[];
  setParentLoading?: (loading: boolean) => void; // used to toggle loading state of parent
  isPatch: boolean;
}

export const AddNotification: React.FC<Props> = ({ isPatch }) => {
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const { sendEvent } = (isPatch ? usePatchAnalytics : useVersionAnalytics)();

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
        Notify Me
      </Button>
      <PatchNotificationModal
        visible={isVisibleModal}
        onCancel={() => setIsVisibleModal(false)}
        isPatch={isPatch}
      />
    </>
  );
};
