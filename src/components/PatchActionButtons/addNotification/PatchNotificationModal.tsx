import React from "react";
import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { NotificationModal } from "components/Notifications/NotificationModal";
import {
  subscriptionMethodControls,
  subscriptionMethodDropdownOptions,
} from "constants/triggers";
import {
  ExtraFieldKey,
  RegexSelector,
  ResourceType,
  Trigger,
  TriggerType,
} from "types/triggers";
import { validators } from "utils";

const { validateDuration, validatePercentage } = validators;

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
      visible={visible}
      onCancel={onCancel}
      triggers={triggers}
      subscriptionMethodControls={subscriptionMethodControls}
      subscriptionMethodDropdownOptions={subscriptionMethodDropdownOptions}
      resourceId={patchId}
      sendAnalyticsEvent={(subscription) =>
        sendEvent({ name: "Add Notification", subscription })
      }
      type="version"
    />
  );
};

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
