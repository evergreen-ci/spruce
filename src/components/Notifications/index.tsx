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
import { LeftButton } from "./styles";

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

  // oops because I did omit it, it goes away.
  const [formState, setFormState] = useState({
    event: {
      eventSelect:
        Cookies.get(getNotificationTriggerCookie(type)) ||
        Object.keys(triggers)[0],
      extraFields: {},
      regexSelector: [],
    },
    notification: {
      notificationSelect: Cookies.get(SUBSCRIPTION_METHOD) ?? "jira-comment",
      jiraInput: "",
      slackInput: slackUsername ? `@${slackUsername}` : "",
      emailInput: emailAddress ?? "",
    },
  });
  const [canSubmit, setCanSubmit] = useState(false);

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
  const getTargetForMethod = (method: string) => {
    if (method === "jira-comment") {
      return formState.notification.jiraInput;
    }
    if (method === "slack") {
      return formState.notification.slackInput;
    }
    return formState.notification.emailInput;
  };

  // needs a type = maybe triggermap and trigger
  const getExtraFields = (event) => {
    if (!event.extraFields) {
      return {};
    }

    const toReturn = {};
    const { extraFields } = formState.event;

    event.extraFields.forEach((e) => {
      toReturn[e.key] = extraFields[e.key];
    });
    return toReturn;
  };

  const getRequestPayload = () => {
    const event = triggers[formState.event.eventSelect];
    const { payloadResourceIdKey, resourceType, trigger } = event;

    const method = formState.notification.notificationSelect;
    const target = getTargetForMethod(method);

    // Only include extraFields if they are part of the trigger
    const extraFields = getExtraFields(event);

    // Only include regex selectors if the trigger specifies it
    const regexSelectors = event.regexSelectors
      ? formState.event.regexSelector.map((r) => ({
          type: r.regexSelect,
          data: r.regexInput,
        }))
      : [];

    console.log("extraFields: ", extraFields);
    console.log("regexSelectors: ", regexSelectors);

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
      trigger_data: extraFields, // ex; { "task-duration-secs" : "10"}
      owner_type: "person",
      regex_selectors: regexSelectors,
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

  const usingID = !!formState.event.regexSelector.find(
    (r) => r.regexSelect === "build-variant"
  );
  const usingName = !!formState.event.regexSelector.find(
    (r) => r.regexSelect === "display-name"
  );
  const regexEnumsToDisable = [
    ...(usingID ? ["build-variant"] : []),
    ...(usingName ? ["display-name"] : []),
  ];

  const { schema, uiSchema } = getFormSchema(
    regexEnumsToDisable,
    triggers,
    subscriptionMethodControls
  );

  // Need to clear the input vals for the extraFields and regex selectors when the selected trigger changes
  // console.log("leformState: ", formState);

  return (
    <Modal
      data-cy={dataCy}
      visible={visible}
      onCancel={onCancel}
      title="Add Subscription"
      footer={
        <>
          <LeftButton
            key="cancel" // @ts-expect-error
            onClick={onCancel}
            data-cy="cancel-subscription-button"
          >
            Cancel
          </LeftButton>
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
