import { useParams } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { NotificationModal } from "components/Notifications";
import { taskTriggers } from "constants/triggers";
import { subscriptionMethods } from "types/subscription";

interface ModalProps {
  visible: boolean;
  onCancel: () => void;
}

export const TaskNotificationModal: React.VFC<ModalProps> = ({
  visible,
  onCancel,
}) => {
  const { id: taskId } = useParams<{ id: string }>();
  const taskAnalytics = useTaskAnalytics();

  return (
    <NotificationModal
      data-cy="task-notification-modal"
      visible={visible}
      onCancel={onCancel}
      triggers={taskTriggers}
      subscriptionMethods={subscriptionMethods}
      resourceId={taskId}
      sendAnalyticsEvent={(subscription) =>
        taskAnalytics.sendEvent({ name: "Add Notification", subscription })
      }
      type="task"
    />
  );
};
