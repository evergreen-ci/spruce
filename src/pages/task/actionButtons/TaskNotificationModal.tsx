import React from "react";
import { useParams } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { NotificationModal } from "components/NotificationModal";
import { SubscriptionMethods } from "hooks/useNotificationModal";
import {
  SUBSCRIPTION_JIRA_COMMENT,
  SUBSCRIPTION_SLACK,
  SUBSCRIPTION_EMAIL,
} from "types/subscription";
import {
  ExtraFieldKey,
  ResourceType,
  Trigger,
  TriggerType,
} from "types/triggers";
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
    trigger: TriggerType.TASK_STARTED,
    label: "This task starts",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
  },
  {
    trigger: TriggerType.OUTCOME,
    label: "This task finishes",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
  },
  {
    trigger: TriggerType.FAILURE,
    label: "This task fails",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
  },
  {
    trigger: TriggerType.TASK_FAILED_OR_BLOCKED,
    label: "This task fails or is blocked",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
  },
  {
    trigger: TriggerType.SUCCESS,
    label: "This task succeeds",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
  },
  {
    trigger: TriggerType.EXCEEDS_DURATION,
    label: "The runtime for this task exceeds some duration",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Task duration (seconds)",
        key: ExtraFieldKey.TASK_DURATION_SECS,
        dataCy: "duration-secs-input",
        validator: validateDuration,
      },
    ],
  },
  {
    trigger: TriggerType.RUNTIME_CHANGE,
    label: "This task succeeds and its runtime changes by some percentage",
    resourceType: ResourceType.TASK,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Percent change",
        key: ExtraFieldKey.TASK_PERCENT_CHANGE,
        dataCy: "percent-change-input",
        validator: validatePercentage,
      },
    ],
  },
];
