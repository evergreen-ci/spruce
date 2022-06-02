import { useMutation } from "@apollo/client";
import Button, { Variant } from "@leafygreen-ui/button";
import { Modal } from "components/Modal";
import { useToastContext } from "context/toast";
import {
  SaveSubscriptionMutation,
  SaveSubscriptionMutationVariables,
} from "gql/generated/types";
import { SAVE_SUBSCRIPTION } from "gql/mutations";
import {
  useNotificationModal,
  UseNotificationModalProps,
} from "hooks/useNotificationModal";
import { SubscriptionMethodDropdownOption } from "types/subscription";
import { NotificationMethod } from "../NotificationMethod";
import { NotificationSelect } from "../NotificationSelect";
import { LeftButton } from "../styles";

interface NotificationModalProps extends UseNotificationModalProps {
  subscriptionMethodDropdownOptions: SubscriptionMethodDropdownOption[];
  sendAnalyticsEvent: (
    subscription: SaveSubscriptionMutationVariables["subscription"]
  ) => void;
  visible: boolean;
  onCancel: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  "data-cy": string;
  type: "task" | "version";
}

export const NotificationModal: React.VFC<NotificationModalProps> = ({
  visible,
  onCancel,
  subscriptionMethodDropdownOptions,
  subscriptionMethodControls,
  triggers,
  resourceId,
  sendAnalyticsEvent,
  "data-cy": dataCy,
  type,
}) => {
  const dispatchToast = useToastContext();
  const [saveSubscription] = useMutation<
    SaveSubscriptionMutation,
    SaveSubscriptionMutationVariables
  >(SAVE_SUBSCRIPTION, {
    onCompleted: () => {
      dispatchToast.success("Your subscription has been added");
    },
    onError: (err) => {
      dispatchToast.error(`Error adding your subscription: '${err.message}'`);
    },
  });

  const {
    disableAddCriteria,
    extraFieldErrorMessages,
    extraFieldInputVals,
    extraFields,
    getRequestPayload,
    isFormValid,
    onClickAddRegexSelector,
    regexSelectorProps,
    selectedSubscriptionMethod,
    selectedTriggerIndex,
    setExtraFieldInputVals,
    setSelectedSubscriptionMethod,
    setSelectedTriggerIndex,
    setTarget,
    showAddCriteria,
    target,
  } = useNotificationModal({
    subscriptionMethodControls,
    triggers,
    resourceId,
    type,
  });
  const onClickSave = () => {
    const subscription = getRequestPayload();
    saveSubscription({
      variables: { subscription },
    });
    sendAnalyticsEvent(subscription);
    onCancel();
  };

  return (
    <Modal
      data-cy={dataCy}
      visible={visible}
      onCancel={onCancel}
      title="Add Subscription"
      footer={
        <>
          {}
          <LeftButton
            key="cancel" /* ts-expect-error */
            /* ts-expect-error */ onClick={onCancel} /* ts-expect-error */
            data-cy="cancel-subscription-button"
          >
            Cancel
          </LeftButton>
          <Button
            key="save"
            data-cy="save-subscription-button"
            disabled={!isFormValid}
            onClick={onClickSave}
            variant={Variant.Primary}
          >
            Save
          </Button>
        </>
      }
    >
      <NotificationSelect
        triggers={triggers}
        extraFields={extraFields}
        selectedTriggerIndex={selectedTriggerIndex}
        showAddCriteria={showAddCriteria}
        setSelectedTriggerIndex={setSelectedTriggerIndex}
        extraFieldInputVals={extraFieldInputVals}
        setExtraFieldInputVals={setExtraFieldInputVals}
        regexSelectorProps={regexSelectorProps}
        disableAddCriteria={disableAddCriteria}
        onClickAddRegexSelector={onClickAddRegexSelector}
      />
      <NotificationMethod
        selectedSubscriptionMethod={selectedSubscriptionMethod}
        setSelectedSubscriptionMethod={setSelectedSubscriptionMethod}
        subscriptionMethodDropdownOptions={subscriptionMethodDropdownOptions}
        subscriptionMethodControls={subscriptionMethodControls}
        target={target}
        setTarget={setTarget}
        extraFieldErrorMessages={extraFieldErrorMessages}
      />
    </Modal>
  );
};

export interface SubscriptionMethodControl {
  label: string;
  placeholder: string;
  targetPath: string;
  validator: (v: string) => boolean;
}

export type ResourceType = "TASK" | "BUILD";
