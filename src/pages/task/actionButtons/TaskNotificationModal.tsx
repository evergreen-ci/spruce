import { useParams } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { NotificationModal } from "components/Notifications/NotificationModal";
import {
  subscriptionMethodControls,
  subscriptionMethodDropdownOptions,
} from "constants/triggers";
import {
  ExtraFieldKey,
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
