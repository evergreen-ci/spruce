import React from "react";
import { useParams } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
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

export const PatchNotificationModal: React.FC<ModalProps> = ({
  visible,
  onCancel,
}) => {
  const { id: taskId } = useParams<{ id: string }>();
  const patchAnalytics = usePatchAnalytics();

  return (
    <NotificationModal
      data-cy="patch-notification-modal"
      visible={visible}
      onCancel={onCancel}
      triggers={triggers}
      subscriptionMethodControls={subscriptionMethodControls}
      subscriptionMethodDropdownOptions={subscriptionMethodDropdownOptions}
      resourceId={taskId}
      sendAnalyticsEvent={(subscription) =>
        patchAnalytics.sendEvent({ name: "Add Notification", subscription })
      }
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

export const triggers: Trigger[] = [
  {
    trigger: "outcome",
    label: "This version finishes",
    resourceType: "VERSION",
    payloadResourceIdKey: "id",
  },
  {
    trigger: "failure",
    label: "This version fails",
    resourceType: "VERSION",
    payloadResourceIdKey: "id",
  },
  {
    trigger: "success",
    label: "This version succeeds",
    resourceType: "VERSION",
    payloadResourceIdKey: "id",
  },
  {
    trigger: "exceeds-duration",
    label: "The runtime for this version exceeds some duration",
    resourceType: "VERSION",
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Version duration (seconds)",
        key: "version-duration-secs",
        dataCy: "duration-secs-input",
        validator: validateDuration,
      },
    ],
  },
  {
    trigger: "runtime-change",
    label: "The runtime for this version changes by some percentage",
    resourceType: "VERSION",
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Percent change",
        key: "version-percent-change",
        dataCy: "percent-change-input",
        validator: validatePercentage,
      },
    ],
  },
  {
    trigger: "outcome",
    resourceType: "BUILD",
    payloadResourceIdKey: "in-version",
    label: "A build-variant in this version finishes",
    regexSelectors: buildRegexSelectors,
  },
  {
    trigger: "failure",
    resourceType: "BUILD",
    payloadResourceIdKey: "in-version",
    label: "A build-variant in this version fails",
    regexSelectors: buildRegexSelectors,
  },
  {
    trigger: "success",
    resourceType: "BUILD",
    payloadResourceIdKey: "in-version",
    label: "A build-variant in this version succeeds",
    regexSelectors: buildRegexSelectors,
  },
];
