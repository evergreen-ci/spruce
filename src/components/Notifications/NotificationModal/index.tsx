import React from "react";
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
  selectedBuildInitiator?: string;
  onChangeSelectedBuildInitiator?: (optionValue: string) => void;
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
  selectedBuildInitiator,
  onChangeSelectedBuildInitiator,
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

  const { isFormValid, getRequestPayload } = useNotificationModal({
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
        subscriptionMethodDropdownOptions={subscriptionMethodDropdownOptions}
        subscriptionMethodControls={subscriptionMethodControls}
        resourceId={resourceId}
        type={type}
        selectedBuildInitiator={selectedBuildInitiator}
        onChangeSelectedBuildInitiator={onChangeSelectedBuildInitiator}
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
