import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import Cookies from "js-cookie";
import { Modal } from "components/Modal";
import { SpruceForm } from "components/SpruceForm";
import {
  getNotificationTriggerCookie,
  SUBSCRIPTION_METHOD,
} from "constants/cookies";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  SaveSubscriptionMutation,
  SaveSubscriptionMutationVariables,
  GetUserQuery,
} from "gql/generated/types";
import { SAVE_SUBSCRIPTION } from "gql/mutations";
import { GET_USER } from "gql/queries";
import { useUserSettings } from "hooks/useUserSettings";
import { SubscriptionMethodOption } from "types/subscription";
import { Trigger } from "types/triggers";
import { getFormSchema } from "./getFormSchema";
import { FormState } from "./types";
import { getRegexEnumsToDisable, getGqlPayload } from "./utils";

interface NotificationModalProps {
  "data-cy": string;
  onCancel: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  resourceId: string;
  sendAnalyticsEvent: (
    subscription: SaveSubscriptionMutationVariables["subscription"]
  ) => void;
  subscriptionMethods: SubscriptionMethodOption[];
  triggers: Trigger;
  type: "task" | "version";
  visible: boolean;
}

export const NotificationModal: React.VFC<NotificationModalProps> = ({
  "data-cy": dataCy,
  onCancel,
  resourceId,
  sendAnalyticsEvent,
  subscriptionMethods,
  triggers,
  type,
  visible,
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

  // Fetch user Slack and email information.
  const { userSettings } = useUserSettings();
  const { slackUsername } = userSettings || {};
  const { data: userData } = useQuery<GetUserQuery>(GET_USER);
  const { user } = userData || {};
  const { emailAddress } = user || {};

  // Define initial form state.
  const [formState, setFormState] = useState<FormState>({
    event: {
      eventSelect:
        Cookies.get(getNotificationTriggerCookie(type)) ||
        Object.keys(triggers)[0],
      extraFields: {},
      regexSelector: [],
    },
    notification: {
      notificationSelect: Cookies.get(SUBSCRIPTION_METHOD) ?? "jira-comment",
      jiraCommentInput: "",
      slackInput: slackUsername ? `@${slackUsername}` : "",
      emailInput: emailAddress ?? "",
    },
  });
  const [canSubmit, setCanSubmit] = useState(false);

  const onClickSave = () => {
    const subscription = getGqlPayload(triggers, resourceId, formState);
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

  const { schema, uiSchema } = getFormSchema(
    getRegexEnumsToDisable(formState.event.regexSelector),
    triggers,
    subscriptionMethods
  );

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

/* @ts-expect-error */
export const LeftButton = styled(Button)`
  margin-right: ${size.s};
`;
