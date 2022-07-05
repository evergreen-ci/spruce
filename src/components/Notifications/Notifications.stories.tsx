import { taskTriggers, versionTriggers } from "constants/triggers";
import WithToastContext from "test_utils/toast-decorator";
import { subscriptionMethods } from "types/subscription";
import { NotificationModal } from ".";

export default {
  title: "Components/Notifications",
  component: NotificationModal,
  decorators: [(story) => WithToastContext(story)],
};

export const Task = () => (
  <NotificationModal
    type="task"
    resourceId="123"
    data-cy="task-notification-modal"
    onCancel={() => {}}
    sendAnalyticsEvent={() => {}}
    visible
    subscriptionMethods={subscriptionMethods}
    triggers={taskTriggers}
  />
);

export const Version = () => (
  <NotificationModal
    type="version"
    resourceId="123"
    data-cy="version-notification-modal"
    onCancel={() => {}}
    sendAnalyticsEvent={() => {}}
    visible
    subscriptionMethods={subscriptionMethods}
    triggers={versionTriggers}
  />
);
