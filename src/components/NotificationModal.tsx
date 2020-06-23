import React from "react";
import { Modal, Select, Input } from "antd";
import { uiColors } from "@leafygreen-ui/palette";
import Button from "@leafygreen-ui/button";
import styled from "@emotion/styled";
import { H2, Body } from "@leafygreen-ui/typography";
import get from "lodash/get";
import set from "lodash/set";
import { SubscriptionMethod } from "types/subscription";
import { v4 as uuid } from "uuid";
import { useBannerDispatchContext } from "context/banners";
import { Variant } from "@leafygreen-ui/button";
import {
  useNotificationModal,
  UseNotificationModalProps,
} from "hooks/useNotificationModal";
import { useMutation } from "@apollo/react-hooks";
import {
  SaveSubscriptionMutation,
  SaveSubscriptionMutationVariables,
} from "gql/generated/types";
import { SAVE_SUBSCRIPTION } from "gql/mutations/save-subscription";

const { Option } = Select;

interface ModalProps extends UseNotificationModalProps {
  visible: boolean;
  subscriptionMethods: SubscriptionMethod[];
  onCancel: () => void;
  sendAnalyticsEvent: (
    subscription: SaveSubscriptionMutationVariables["subscription"]
  ) => void;
}

export const NotificationModal: React.FC<ModalProps> = ({
  visible,
  onCancel,
  subscriptionMethods,
  subscriptionMethodControls,
  triggers,
  resourceId,
  resourceType,
  sendAnalyticsEvent,
}) => {
  const dispatchBanner = useBannerDispatchContext();
  const [saveSubscription, { loading: mutationLoading }] = useMutation<
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
  const {
    selectedSubscriptionMethod,
    isFormValid,
    selectedTriggerId,
    setSelectedTriggerId,
    extraFields,
    extraFieldInputVals,
    setExtraFieldInputVals,
    setSelectedSubscriptionMethod,
    target,
    setTarget,
    extraFieldErrorMessages,
    getRequestPayload,
  } = useNotificationModal({
    subscriptionMethodControls,
    triggers,
    resourceType,
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

  return (
    <StyledModal
      centered
      data-test-id="subscription-modal"
      footer={null}
      visible={visible}
      onCancel={onCancel}
      width="50%"
      wrapProps={{
        "data-cy": "task-notification-modal",
      }}
    >
      <ModalTitle>Add Subscription</ModalTitle>
      <Section>
        <Body weight="medium">Choose an event</Body>
        <SectionLabelContainer>
          <InputLabel>Event</InputLabel>
        </SectionLabelContainer>
        <StyledSelect
          value={selectedTriggerId}
          onChange={(v: string) => {
            setSelectedTriggerId(v);
          }}
          data-test-id="when-select"
        >
          {triggers.map((t) => (
            <Option
              key={t.trigger}
              value={t.trigger}
              data-test-id={`${t.trigger}-option`}
            >
              {t.label}
            </Option>
          ))}
        </StyledSelect>
        {extraFields &&
          extraFields.map(({ text, key }) => (
            <ExtraFieldContainer key={key}>
              <SectionLabelContainer>
                <InputLabel htmlFor={`${key}-input`}>{text}</InputLabel>
              </SectionLabelContainer>
              <StyledInput
                data-cy={`${key}-input`}
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
          {subscriptionMethods.map((s) => (
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
      <Footer>
        <LeftButton
          key="cancel"
          onClick={onCancel}
          dataCy="cancel-subscription-button"
        >
          Cancel
        </LeftButton>
        <Button
          key="save"
          dataCy="save-subscription-button"
          loading={mutationLoading}
          disabled={!isFormValid}
          onClick={onClickSave}
          variant={Variant.Primary}
        >
          Save
        </Button>
      </Footer>
    </StyledModal>
  );
};
export interface SubscriptionMethodControl {
  label: string;
  placeholder: string;
  targetPath: string;
  validator: (v: string) => boolean;
}

const StyledSelect = styled(Select)`
  width: 80%;
  margin-bottom: 8px;
`;

const StyledInput = styled(Input)`
  width: 80%;
`;

const ExtraFieldContainer = styled.div`
  margin-bottom: 8px;
`;
const ErrorMessage = styled(Body)`
  color: ${uiColors.red.base};
`;

const borderBottom = `1px solid ${uiColors.gray.light2};`;

const Section = styled.div`
  padding-bottom: 24px;
  margin-bottom: 22px;
  border-bottom: ${borderBottom};
`;

const SectionLabelContainer = styled.div`
  padding-top: 16px;
`;

const ModalTitle = styled(H2)`
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: ${borderBottom};
`;

const Footer = styled.div`
  padding-top: 24px;
  float: right;
`;

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding-bottom: 89px;
  }
`;

const LeftButton = styled(Button)`
  margin-right: 16px;
`;

const InputLabel = styled.label`
  font-size: 14px;
`;
