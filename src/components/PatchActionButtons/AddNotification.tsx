import React, { useState } from "react";
import { usePatchAnalytics } from "analytics";
import { Button } from "components/Button";
import { PatchNotificationModal } from "./addNotification/PatchNotificationModal";

interface Props {
  patchId: string;
  refetchQueries: string[];
  setParentLoading?: (loading: boolean) => void; // used to toggle loading state of parent
}

export const AddNotification: React.FC<Props> = () => {
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const patchAnalytics = usePatchAnalytics();

  return (
    <>
      <Button
        size="small"
        data-cy="notify-patch"
        onClick={() => {
          patchAnalytics.sendEvent({ name: "Open Notification Modal" });
          setIsVisibleModal(true);
        }}
      >
        Notify Me
      </Button>
      <PatchNotificationModal
        visible={isVisibleModal}
        onCancel={() => setIsVisibleModal(false)}
      />
    </>
  );
};
