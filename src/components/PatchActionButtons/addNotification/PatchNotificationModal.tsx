import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { NotificationModal } from "components/Notifications";
import { versionTriggers } from "constants/triggers";
import { subscriptionMethods as versionSubscriptionMethods } from "types/subscription";

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
      onCancel={onCancel}
      resourceId={patchId}
      sendAnalyticsEvent={(subscription) =>
        sendEvent({ name: "Add Notification", subscription })
      }
      subscriptionMethods={versionSubscriptionMethods}
      triggers={versionTriggers}
      type="version"
      visible={visible}
    />
  );
};
