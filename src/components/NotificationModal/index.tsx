import React, { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { Select, Input } from "antd";
import get from "lodash/get";
import set from "lodash/set";
import { v4 as uuid } from "uuid";
import { Modal } from "components/Modal";
import { RegexSelectorInput } from "components/NotificationModal/RegexSelectorInput";
import { ErrorMessage } from "components/styles";
import { useBannerDispatchContext } from "context/banners";
import {
  GetUserSettingsQuery,
  GetUserQuery,
  SaveSubscriptionMutation,
  SaveSubscriptionMutationVariables,
} from "gql/generated/types";
import { SAVE_SUBSCRIPTION } from "gql/mutations/save-subscription";
import { GET_USER_SETTINGS, GET_USER } from "gql/queries";
import {
  useNotificationModal,
  UseNotificationModalProps,
} from "hooks/useNotificationModal";
import {
  SubscriptionMethodDropdownOption,
  SUBSCRIPTION_SLACK,
  SUBSCRIPTION_EMAIL,
} from "types/subscription";

const { Option } = Select;
const { gray } = uiColors;
interface NotificationModalProps extends UseNotificationModalProps {
  subscriptionMethodDropdownOptions: SubscriptionMethodDropdownOption[];
  sendAnalyticsEvent: (
    subscription: SaveSubscriptionMutationVariables["subscription"]
  ) => void;
  visible: boolean;
  onCancel: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  "data-cy": string;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onCancel,
  subscriptionMethodDropdownOptions,
  subscriptionMethodControls,
  triggers,
  resourceId,
  sendAnalyticsEvent,
  "data-cy": dataCy,
}) => {
  const dispatchBanner = useBannerDispatchContext();
  const [saveSubscription] = useMutation<
    SaveSubscriptionMutation,
    SaveSubscriptionMutationVariables
  >(SAVE_SUBSCRIPTION, {
    onCompleted: () => {
      dispatchBanner.successBanner("Your subscription has been added");
    },
    onError: (err) => {
      dispatchBanner.errorBanner(
        `Error adding your subscription: '${err.message}'`
      );
    },
  });

  // USER SETTINGS QUERY
  const { data: userSettingsData } = useQuery<GetUserSettingsQuery>(
    GET_USER_SETTINGS
  );

  // USER QUERY
  const { data: userData } = useQuery<GetUserQuery>(GET_USER);
  console.log({ userData });
  const slackUsername = userSettingsData?.userSettings?.slackUsername;
  const emailAddress = userData?.user?.emailAddress;
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
  });
  const onClickSave = () => {
    const subscription = getRequestPayload();
    saveSubscription({
      variables: { subscription },
    });
    sendAnalyticsEvent(subscription);
    onCancel();
  };
  const currentMethodControl = subscriptionMethodControls[
    selectedSubscriptionMethod
  ] as SubscriptionMethodControl;
  const label = get(currentMethodControl, "label");
  const placeholder = get(currentMethodControl, "placeholder");
  const targetPath = get(currentMethodControl, "targetPath");

  useEffect(() => {
    switch (selectedSubscriptionMethod) {
      case SUBSCRIPTION_SLACK.value:
        if (slackUsername && slackUsername !== "") {
          const targetCopy = { ...target };
          set(targetCopy, targetPath, slackUsername);
          setTarget(targetCopy);
        }
        break;
      case SUBSCRIPTION_EMAIL.value:
        if (emailAddress && emailAddress !== "") {
          const targetCopy = { ...target };
          set(targetCopy, targetPath, emailAddress);
          setTarget(targetCopy);
        }
        break;
      default:
        break;
    }
  }, [selectedSubscriptionMethod, slackUsername, emailAddress]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Modal
      data-cy={dataCy}
      visible={visible}
      onCancel={onCancel}
      title="Add Subscription"
      footer={
        <>
          <LeftButton
            key="cancel"
            onClick={onCancel}
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
      <Section>
        <Body weight="medium">Choose an event</Body>
        <SectionLabelContainer>
          <InputLabel>Event</InputLabel>
        </SectionLabelContainer>
        <StyledSelect
          value={selectedTriggerIndex}
          onChange={(v: number) => {
            setSelectedTriggerIndex(v);
          }}
          data-test-id="when-select"
        >
          {triggers.map((t, i) => (
            <Option key={uuid()} value={i} data-test-id={`trigger_${i}-option`}>
              {t.label}
            </Option>
          ))}
        </StyledSelect>
        {extraFields &&
          extraFields.map(({ text, key, dataCy: inputDataCy }) => (
            <ExtraFieldContainer key={key}>
              <SectionLabelContainer>
                <InputLabel htmlFor={`${key}-input`}>{text}</InputLabel>
              </SectionLabelContainer>
              <StyledInput
                data-cy={inputDataCy}
                id={`${key}-input`}
                onChange={(event) => {
                  setExtraFieldInputVals({
                    ...extraFieldInputVals,
                    [key]: event.target.value,
                  });
                }}
                value={extraFieldInputVals[key]}
              />
            </ExtraFieldContainer>
          ))}
        {showAddCriteria && (
          <>
            <RegexSelectorInputContainer>
              {regexSelectorProps.map((props, i) => (
                <RegexSelectorInput canDelete dataCyPrefix={i} {...props} />
              ))}
            </RegexSelectorInputContainer>
            <Button
              data-cy="add-regex-selector-button"
              disabled={disableAddCriteria}
              onClick={onClickAddRegexSelector}
            >
              <Icon glyph="Plus" />
              Add additional criteria
            </Button>
          </>
        )}
      </Section>
      <div>
        <Body weight="medium">Choose how to be notified</Body>
        <SectionLabelContainer>
          <InputLabel htmlFor="notify-by-select">
            Notification method
          </InputLabel>
        </SectionLabelContainer>
        <StyledSelect
          id="notify-by-select"
          data-test-id="notify-by-select"
          value={selectedSubscriptionMethod}
          onChange={(v: string) => {
            setSelectedSubscriptionMethod(v);
          }}
        >
          {subscriptionMethodDropdownOptions.map((s) => (
            <Option
              key={s.value}
              value={s.value}
              data-test-id={`${s.value}-option`}
            >
              {s.label}
            </Option>
          ))}
        </StyledSelect>
      </div>
      <div>
        {currentMethodControl && (
          <>
            <SectionLabelContainer>
              <InputLabel htmlFor="target">{label}</InputLabel>
            </SectionLabelContainer>
            <StyledInput
              id="target"
              placeholder={placeholder}
              data-test-id={`${targetPath}-input`}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const targetCopy = { ...target };
                set(targetCopy, targetPath, event.target.value);
                setTarget(targetCopy);
              }}
              value={get(target, targetPath, "")}
            />
          </>
        )}
      </div>
      <div>
        {extraFieldErrorMessages.map((text) => (
          <span key={uuid()} data-cy="error-message">
            <ErrorMessage>{text}</ErrorMessage>
          </span>
        ))}
      </div>
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

const inputWidth = "width: calc(80% - 55px);";

const StyledSelect = styled(Select)`
  ${inputWidth}
  margin-bottom: 8px;
`;

const StyledInput = styled(Input)`
  ${inputWidth}
`;

const ExtraFieldContainer = styled.div`
  margin-bottom: 8px;
`;

const Section = styled.div`
  padding-bottom: 24px;
  margin-bottom: 22px;
  border-bottom: 1px solid ${gray.light2};
`;

const RegexSelectorInputContainer = styled.div`
  padding-top: 8px;
`;
const SectionLabelContainer = styled.div`
  padding-top: 16px;
`;

const LeftButton = styled(Button)`
  margin-right: 16px;
`;

const InputLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
`;
