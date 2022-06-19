import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { NotificationModal } from "components/Notifications";
import { subscriptionMethodControls, patchTriggers } from "constants/triggers";

interface ModalProps {
  visible: boolean;
  onCancel: () => void;
}

export const PatchNotificationModal: React.VFC<ModalProps> = ({
  visible,
  onCancel,
}) => {
  const { id: patchId } = useParams<{ id: string }>();
  const { sendEvent } = useVersionAnalytics(patchId);

  return (
    <NotificationModal
      data-cy="patch-notification-modal"
      visible={visible}
      onCancel={onCancel}
      triggers={patchTriggers}
      subscriptionMethodControls={subscriptionMethodControls}
      resourceId={patchId}
      sendAnalyticsEvent={(subscription) =>
        sendEvent({ name: "Add Notification", subscription })
      }
      type="version"
    />
  );
};
