import React from "react";
import { NotificationModal } from "components/NotificationModal";
import {
  SubscriptionMethods,
  Trigger,
  RegexSelector,
} from "hooks/useNotificationModal";
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
import { useTaskAnalytics } from "analytics";

interface ModalProps {
  visible: boolean;
  onCancel: () => void;
}

export const PatchNotificationModal: React.FC<ModalProps> = ({
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
      subscriptionMethods={subscriptionMethods}
      resourceId={taskId}
      sendAnalyticsEvent={(subscription) =>
        taskAnalytics.sendEvent({ name: "Add Notification", subscription })
      }
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

const buildRegexSelectors: RegexSelector[] = [
  {
    type: "display-name",
    typeLabel: "Build Variant Name",
  },
  {
    type: "build-variant",
    typeLabel: "Build Variant ID",
  },
];

const triggers: Trigger[] = [
  {
    trigger: "outcome",
    label: "This task finishes",
    resourceType: "VERSION",
    payloadResourceIdKey: "id",
  },
  {
    trigger: "failure",
    label: "This task fails",
    resourceType: "VERSION",
    payloadResourceIdKey: "id",
  },
  {
    trigger: "success",
    label: "This task succeeds",
    resourceType: "VERSION",
    payloadResourceIdKey: "id",
  },
  {
    trigger: "exceeds-duration",
    label: "The runtime for this task exceeds some duration",
    resourceType: "VERSION",
    payloadResourceIdKey: "id",
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
    label: "This task succeeds and its runtime changes by some percentage",
    resourceType: "VERSION",
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Percent change",
        key: "task-percent-change",
        validator: validatePercentage,
      },
    ],
  },
  {
    trigger: "outcome",
    resourceType: "BUILD",
    payloadResourceIdKey: "in-version",
    label: "a build-variant in this version finishes",
    regexSelectors: buildRegexSelectors,
  },
  {
    trigger: "failure",
    resourceType: "BUILD",
    payloadResourceIdKey: "in-version",
    label: "a build-variant in this version fails",
    regexSelectors: buildRegexSelectors,
  },
  {
    trigger: "success",
    resourceType: "BUILD",
    payloadResourceIdKey: "in-version",
    label: "a build-variant in this version succeeds",
    regexSelectors: buildRegexSelectors,
  },
];
