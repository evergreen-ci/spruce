import React from "react";
import { useParams } from "react-router-dom";
import { usePatchAnalytics, useVersionAnalytics } from "analytics";
import { NotificationModal } from "components/NotificationModal";
import { SubscriptionMethods } from "hooks/useNotificationModal";
import {
  SUBSCRIPTION_JIRA_COMMENT,
  SUBSCRIPTION_SLACK,
  SUBSCRIPTION_EMAIL,
} from "types/subscription";
import {
  ExtraFieldKey,
  RegexSelector,
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
  isPatch: boolean;
}

export const PatchNotificationModal: React.FC<ModalProps> = ({
  visible,
  onCancel,
  isPatch,
}) => {
  const { id: taskId } = useParams<{ id: string }>();
  const { sendEvent } = (isPatch ? usePatchAnalytics : useVersionAnalytics)();

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
        sendEvent({ name: "Add Notification", subscription })
      }
      type="version"
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
    trigger: TriggerType.OUTCOME,
    label: "This version finishes",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
  },
  {
    trigger: TriggerType.FAILURE,
    label: "This version fails",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
  },
  {
    trigger: TriggerType.SUCCESS,
    label: "This version succeeds",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
  },
  {
    trigger: TriggerType.EXCEEDS_DURATION,
    label: "The runtime for this version exceeds some duration",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Version duration (seconds)",
        key: ExtraFieldKey.VERSION_DURATION_SECS,
        dataCy: "duration-secs-input",
        validator: validateDuration,
      },
    ],
  },
  {
    trigger: TriggerType.RUNTIME_CHANGE,
    label: "The runtime for this version changes by some percentage",
    resourceType: ResourceType.VERSION,
    payloadResourceIdKey: "id",
    extraFields: [
      {
        text: "Percent change",
        key: ExtraFieldKey.VERSION_PERCENT_CHANGE,
        dataCy: "percent-change-input",
        validator: validatePercentage,
      },
    ],
  },
  {
    trigger: TriggerType.OUTCOME,
    resourceType: ResourceType.BUILD,
    payloadResourceIdKey: "in-version",
    label: "A build-variant in this version finishes",
    regexSelectors: buildRegexSelectors,
  },
  {
    trigger: TriggerType.FAILURE,
    resourceType: ResourceType.BUILD,
    payloadResourceIdKey: "in-version",
    label: "A build-variant in this version fails",
    regexSelectors: buildRegexSelectors,
  },
  {
    trigger: TriggerType.SUCCESS,
    resourceType: ResourceType.BUILD,
    payloadResourceIdKey: "in-version",
    label: "A build-variant in this version succeeds",
    regexSelectors: buildRegexSelectors,
  },
];
