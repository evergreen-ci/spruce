import React from "react";
import { useParams } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { NotificationModal } from "components/NotificationModal";
import { SubscriptionMethods, Trigger } from "hooks/useNotificationModal";
import {
  SUBSCRIPTION_JIRA_COMMENT,
  SUBSCRIPTION_SLACK,
  SUBSCRIPTION_EMAIL,
} from "types/subscription";
import { validators } from "utils";

const {
  validateDuration,
  validatePercentage,
  validateEmail,
  validateJira,
  validateSlack,
} = validators;

interface ModalProps {
  visible: boolean;
  onCancel: () => void;
}

export const TaskNotificationModal: React.FC<ModalProps> = ({
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
      triggers={triggers}
      subscriptionMethodControls={subscriptionMethodControls}
      subscriptionMethodDropdownOptions={subscriptionMethodDropdownOptions}
      resourceId={taskId}
      sendAnalyticsEvent={(subscription) =>
        taskAnalytics.sendEvent({ name: "Add Notification", subscription })
      }
      type="task"
    />
  );
};

export const subscriptionMethodControls: SubscriptionMethods = {
  "jira-comment": {
    label: "JIRA Issue",
    placeholder: "ABC-123",
    targetPath: "jira-comment",
    validator: validateJira,
  },
  email: {
    label: "Email Address",
    placeholder: "someone@example.com",
    targetPath: "email",
    validator: validateEmail,
  },
  slack: {
    label: "Slack Username or Channel",
    placeholder: "@user",
    targetPath: "slack",
    validator: validateSlack,
  },
};

const subscriptionMethodDropdownOptions = [
  SUBSCRIPTION_JIRA_COMMENT,
  SUBSCRIPTION_SLACK,
  SUBSCRIPTION_EMAIL,
];

export const triggers: Trigger[] = [
  {
    trigger: "outcome",
    label: "This task finishes",
    resourceType: "TASK",
    payloadResourceIdKey: "id",
  },
  {
    trigger: "failure",
    label: "This task fails",
    resourceType: "TASK",
    payloadResourceIdKey: "id",
  },
  {
    trigger: "task-failed-or-blocked",
    label: "This task fails or is blocked",
    resourceType: "TASK",
    payloadResourceIdKey: "id",
  },
  {
    trigger: "success",
    label: "This task succeeds",
    resourceType: "TASK",
    payloadResourceIdKey: "id",
  },
  {
    trigger: "exceeds-duration",
    label: "The runtime for this task exceeds some duration",
    resourceType: "TASK",
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Task duration (seconds)",
        key: "task-duration-secs",
        dataCy: "duration-secs-input",
        validator: validateDuration,
      },
    ],
  },
  {
    trigger: "runtime-change",
    label: "This task succeeds and its runtime changes by some percentage",
    resourceType: "TASK",
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Percent change",
        key: "task-percent-change",
        dataCy: "percent-change-input",
        validator: validatePercentage,
      },
    ],
  },
];
