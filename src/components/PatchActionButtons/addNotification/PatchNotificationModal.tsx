import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { NotificationModal } from "components/Notifications";
import { patchTriggers } from "constants/triggers";
import { subscriptionMethods } from "types/subscription";

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
      subscriptionMethods={subscriptionMethods}
      resourceId={patchId}
      sendAnalyticsEvent={(subscription) =>
        sendEvent({ name: "Add Notification", subscription })
      }
      type="version"
    />
  );
};
