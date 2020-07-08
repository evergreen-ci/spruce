import React, { useState } from "react";
import { Button } from "components/Button";
import { usePatchAnalytics } from "analytics";
import { PatchNotificationModal } from "./addNotification/PatchNotificationModal";
interface Props {
  patchId: string;
  hideMenu: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
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
        dataCy="notify-patch"
        onClick={() => {
          if (!isVisibleModal) {
            patchAnalytics.sendEvent({ name: "Open Notification Modal" });
          }
          setIsVisibleModal(!isVisibleModal);
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
