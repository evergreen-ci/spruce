import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Cookies from "js-cookie";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm } from "components/SpruceForm";
import {
  getNotificationTriggerCookie,
  SUBSCRIPTION_METHOD,
} from "constants/cookies";
import { size } from "constants/tokens";
import { regexDisplayName, regexBuildVariant } from "constants/triggers";
import { useToastContext } from "context/toast";
import {
  SaveSubscriptionForUserMutation,
  SaveSubscriptionForUserMutationVariables,
  UserQuery,
} from "gql/generated/types";
import { SAVE_SUBSCRIPTION } from "gql/mutations";
import { USER } from "gql/queries";
import { useUserSettings } from "hooks/useUserSettings";
import { SubscriptionMethodOption } from "types/subscription";
import { Trigger } from "types/triggers";
import { getFormSchema } from "./form/getFormSchema";
import { FormState, FormRegexSelector } from "./types";
import { hasInitialError, getGqlPayload } from "./utils";

interface NotificationModalProps {
  "data-cy": string;
  onCancel: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  resourceId: string;
  sendAnalyticsEvent: (
    subscription: SaveSubscriptionForUserMutationVariables["subscription"],
  ) => void;
  subscriptionMethods: SubscriptionMethodOption[];
  triggers: Trigger;
  type: "task" | "version" | "project";
  visible: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
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
    SaveSubscriptionForUserMutation,
    SaveSubscriptionForUserMutationVariables
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
  const { data: userData } = useQuery<UserQuery>(USER);
  const { user } = userData || {};
  const { emailAddress } = user || {};

  // Define initial form state.
  const [formState, setFormState] = useState<FormState>({
    event: {
      eventSelect:
        Cookies.get(getNotificationTriggerCookie(type)) ??
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
  const [hasError, setHasError] = useState(hasInitialError(formState));

  const onClickSave = () => {
    const subscription = getGqlPayload(type, triggers, resourceId, formState);
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
    subscriptionMethods,
  );

  return (
    <ConfirmationModal
      data-cy={dataCy}
      open={visible}
      onCancel={onCancel}
      title="Add Subscription"
      onConfirm={onClickSave}
      submitDisabled={hasError}
      buttonText="Save"
    >
      <SpruceForm
        schema={schema}
        uiSchema={uiSchema}
        formData={formState}
        onChange={({ errors, formData }) => {
          // Update event cookie when it changes.
          updateEventCookie(formData.event.eventSelect);
          // Update notification cookie when it changes.
          updateNotificationCookie(formData.notification.notificationSelect);
          setFormState(formData);
          setHasError(errors.length !== 0);
        }}
      />
    </ConfirmationModal>
  );
};

const getRegexEnumsToDisable = (regexForm: FormRegexSelector[]) => {
  const usingID = !!regexForm.find((r) => r.regexSelect === regexBuildVariant);
  const usingName = !!regexForm.find((r) => r.regexSelect === regexDisplayName);
  const regexEnumsToDisable = [
    ...(usingID ? [regexBuildVariant] : []),
    ...(usingName ? [regexDisplayName] : []),
  ];
  return regexEnumsToDisable;
};

export const LeftButton = styled(Button)`
  margin-right: ${size.s};
`;
