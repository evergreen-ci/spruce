import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { DropdownItem } from "components/ButtonDropdown";
import { NotificationModal } from "components/Notifications";
import { waterfallTriggers } from "constants/triggers";
import { subscriptionMethods } from "types/subscription";

export const AddNotification: React.VFC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  return (
    <>
      <DropdownItem
        data-cy="add-notification"
        onClick={() => {
          setIsModalVisible(true);
          sendEvent({ name: "Open Notification Modal" });
        }}
      >
        Add Notification
      </DropdownItem>
      <NotificationModal
        data-cy="waterfall-notification-modal"
        onCancel={() => setIsModalVisible(false)}
        resourceId={projectId}
        sendAnalyticsEvent={(subscription) =>
          sendEvent({ name: "Add Notification", subscription })
        }
        subscriptionMethods={subscriptionMethods}
        triggers={waterfallTriggers}
        type="project"
        visible={isModalVisible}
      />
    </>
  );
};
