import React from "react";
import { NotificationModal } from "components/NotificationModal";
import { SubscriptionMethods, Trigger } from "hooks/useNotificationModal";
import {
  SUBSCRIPTION_JIRA_COMMENT,
  SUBSCRIPTION_SLACK,
  SUBSCRIPTION_EMAIL,
} from "types/subscription";
import {
  validateDuration,
  validatePercentage,
  validateEmail,
  validateJira,
  validateSlack,
} from "utils/validators";
import { useParams } from "react-router-dom";

interface ModalProps {
  visible: boolean;
  onCancel: () => void;
}

export const TaskNotificationModal: React.FC<ModalProps> = ({
  visible,
  onCancel,
}) => {
  const { id: taskId } = useParams<{ id: string }>();
  return (
    <NotificationModal
      visible={visible}
      onCancel={onCancel}
      triggers={triggers}
      subscriptionMethodControls={subscriptionMethodControls}
      subscriptionMethods={subscriptionMethods}
      resourceType="TASK"
      resourceId={taskId}
    />
  );
};

const subscriptionMethodControls: SubscriptionMethods = {
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

const subscriptionMethods = [
  SUBSCRIPTION_JIRA_COMMENT,
  SUBSCRIPTION_SLACK,
  SUBSCRIPTION_EMAIL,
];

const triggers: Trigger[] = [
  {
    trigger: "outcome",
    label: "this task finishes",
  },
  {
    trigger: "failure",
    label: "this task fails",
  },
  {
    trigger: "success",
    label: "this task succeeds",
  },
  {
    trigger: "exceeds-duration",
    label: "the runtime for this task exceeds some duration",
    extraFields: [
      {
        text: "Task duration (seconds)",
        key: "task-duration-secs",
        validator: validateDuration,
      },
    ],
  },
  {
    trigger: "runtime-change",
    label: "this task succeeds and its runtime changes by some percentage",
    extraFields: [
      {
        text: "Percent change",
        key: "task-percent-change",
        validator: validatePercentage,
      },
    ],
  },
];
