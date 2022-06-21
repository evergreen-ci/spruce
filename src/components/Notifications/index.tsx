import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Button, { Variant } from "@leafygreen-ui/button";
import Cookies from "js-cookie";
import { Modal } from "components/Modal";
import { SpruceForm } from "components/SpruceForm";
import {
  getNotificationTriggerCookie,
  SUBSCRIPTION_METHOD,
} from "constants/cookies";
import { projectTriggers } from "constants/triggers";
import { useToastContext } from "context/toast";
import {
  SaveSubscriptionMutation,
  SaveSubscriptionMutationVariables,
  GetUserQuery,
} from "gql/generated/types";
import { SAVE_SUBSCRIPTION } from "gql/mutations";
import { GET_USER } from "gql/queries";
import { UseNotificationModalProps } from "hooks/useNotificationModal";
import { useUserSettings } from "hooks/useUserSettings";
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

  const { userSettings } = useUserSettings();
  const { slackUsername } = userSettings || {};

  const { data: userData } = useQuery<GetUserQuery>(GET_USER);
  const { user } = userData || {};
  const { emailAddress } = user || {};

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
    // this should be done better
    const target = formState.notification.jiraInput;

    // extraFieldInputVals is a string map{ "task1-field": "10", "task2-field": "10" }
    // regex_selectors needs to look like { type: something, data: something }
    // const regexSelectors = formState.event.regexSelector;
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
      trigger_data: {}, // ex; { "task-duration-secs" : "10"}
      owner_type: "person",
      regex_selectors: [{ type: "ooh", data: "ahh" }],
      // regexSelectors.map(([regexSelect, regexInput]) => ({
      //   type: regexSelect,
      //   data: regexInput,
      // })),
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

  const [formState, setFormState] = useState({
    event: {
      eventSelect:
        Cookies.get(getNotificationTriggerCookie(type)) ||
        Object.keys(triggers)[0],
    },
    notification: {
      notificationSelect: Cookies.get(SUBSCRIPTION_METHOD) ?? "jira-comment",
      jiraInput: "",
      slackInput: slackUsername ? `@${slackUsername}` : "",
      emailInput: emailAddress ?? "",
    },
  });
  const [canSubmit, setCanSubmit] = useState(false);

  // turn this back later
  const { schema, uiSchema } = getFormSchema(
    formState,
    projectTriggers,
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
