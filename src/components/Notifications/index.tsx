import { useState } from "react";
import { useMutation } from "@apollo/client";
import Button, { Variant } from "@leafygreen-ui/button";
import Cookies from "js-cookie";
import { Modal } from "components/Modal";
import { SpruceForm } from "components/SpruceForm";
import {
  getNotificationTriggerCookie,
  SUBSCRIPTION_METHOD,
} from "constants/cookies";
import { useToastContext } from "context/toast";
import {
  SaveSubscriptionMutation,
  SaveSubscriptionMutationVariables,
} from "gql/generated/types";
import { SAVE_SUBSCRIPTION } from "gql/mutations";
import { UseNotificationModalProps } from "hooks/useNotificationModal";
import { getFormSchema } from "./getFormSchema";

interface NotificationModalProps extends UseNotificationModalProps {
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

  // Subscription input looks like
  // {
  //   id?: Maybe<Scalars["String"]>;
  //   resource_type?: Maybe<Scalars["String"]>;
  //   trigger?: Maybe<Scalars["String"]>;
  //   selectors: Array<SelectorInput>;
  //   regex_selectors: Array<SelectorInput>;
  //   subscriber: SubscriberInput;
  //   owner_type?: Maybe<Scalars["String"]>;
  //   owner?: Maybe<Scalars["String"]>;
  //   trigger_data: Scalars["StringMap"];
  // }

  // This is the payload sent when processing notifications.
  const getRequestPayload = () => {
    const selectedEvent = triggers[formState.event.eventSelect];
    const { payloadResourceIdKey, resourceType, trigger } = selectedEvent;

    const method = formState.notification.notificationSelect;
    const target = formState.notification.notificationInput;

    // extraFieldInputVals is a string map so it looks like { something: {}, other: {}}
    // regex_selectors needs to look like { type: something, data: something }
    const regexSelectors = formState.event.regexSelector;
    return {
      trigger,
      resource_type: resourceType,
      selectors: [
        { type: "object", data: resourceType.toLowerCase() },
        { type: payloadResourceIdKey, data: resourceId },
      ],
      subscriber: {
        type: method,
        target,
      },
      trigger_data: {},
      owner_type: "person",
      regex_selectors: regexSelectors.map(([regexSelect, regexInput]) => ({
        type: regexSelect,
        data: regexInput,
      })),
    };
  };

  const onClickSave = () => {
    const subscription = getRequestPayload();
    saveSubscription({
      variables: { subscription },
    });
    sendAnalyticsEvent(subscription);
    onCancel();
  };

  const handleSubmit = () => {
    console.log("submitted form");
  };

  // formState
  const [formState, setFormState] = useState({
    event: {
      eventSelect:
        Cookies.get(getNotificationTriggerCookie(type)) ||
        Object.keys(triggers)[0],
      regexSelector: [],
    },
    notification: {
      notificationSelect: Cookies.get(SUBSCRIPTION_METHOD) ?? "jira-comment",
      notificationInput: "",
    },
  });
  const [canSubmit, setCanSubmit] = useState(false);

  const { schema, uiSchema } = getFormSchema(
    formState,
    triggers,
    subscriptionMethodControls
  );

  const updateEventCookie = (newEvent: string) => {
    // If user selected a new event, update cookie
    if (formState.event.eventSelect !== newEvent) {
      Cookies.set(`${type}-notification-trigger`, `${newEvent}`, {
        expires: 365,
      });
    }
  };

  const updateNotificationCookie = (newMethod: string) => {
    // If user selected a new notification method, update cookie
    if (formState.notification.notificationSelect !== newMethod) {
      Cookies.set(SUBSCRIPTION_METHOD, newMethod, { expires: 365 });
    }
  };

  // Need to clear the input vals for the extraFields and regex selectors when the selected trigger changes

  console.log(formState);

  return (
    <Modal
      data-cy={dataCy}
      visible={visible}
      onCancel={onCancel}
      title="Add Subscription"
      footer={
        <>
          <Button
            key="cancel"
            onClick={onCancel}
            data-cy="cancel-subscription-button"
          >
            Cancel
          </Button>
          <Button
            key="save"
            data-cy="save-subscription-button"
            disabled={!canSubmit}
            onClick={onClickSave}
            variant={Variant.Primary}
          >
            Save
          </Button>
        </>
      }
    >
      <SpruceForm
        onSubmit={handleSubmit}
        schema={schema}
        uiSchema={uiSchema}
        formData={formState}
        onChange={({ formData, errors }) => {
          // Update event cookie when it changes.
          updateEventCookie(formData.event.eventSelect);
          // Update notification cookie when it changes.
          updateNotificationCookie(formData.notification.notificationSelect);

          setFormState(formData);
          setCanSubmit(errors.length === 0);
        }}
      />
    </Modal>
  );
};
