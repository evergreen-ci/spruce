import React from "react";
import { Select, Input } from "antd";
import { Modal } from "components/Modal";
import { uiColors } from "@leafygreen-ui/palette";
import Button, { Variant } from "@leafygreen-ui/button";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import get from "lodash/get";
import set from "lodash/set";
import { SubscriptionMethod } from "types/subscription";
import { v4 as uuid } from "uuid";
import { useBannerDispatchContext } from "context/banners";
import Icon from "@leafygreen-ui/icon";
import {
  useNotificationModal,
  UseNotificationModalProps,
  RegexSelector,
} from "hooks/useNotificationModal";
import { useMutation } from "@apollo/react-hooks";
import {
  SaveSubscriptionMutation,
  SaveSubscriptionMutationVariables,
} from "gql/generated/types";
import { SAVE_SUBSCRIPTION } from "gql/mutations/save-subscription";

const { Option } = Select;

interface NotificationModalProps extends UseNotificationModalProps {
  subscriptionMethods: SubscriptionMethod[];
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
  subscriptionMethods,
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
  const {
    selectedSubscriptionMethod,
    isFormValid,
    selectedTriggerIndex,
    setSelectedTriggerIndex,
    extraFields,
    extraFieldInputVals,
    setExtraFieldInputVals,
    setSelectedSubscriptionMethod,
    target,
    onClickAddRegexSelector,
    setRegexSelectorInputs,
    regexSelectorInputs,
    showAddCriteria,
    setTarget,
    extraFieldErrorMessages,
    getRequestPayload,
    dropdownOptions,
    disabledOptions,
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
            <Option
              key={uuid()}
              value={i}
              data-test-id={`${t.trigger}_${t.label}-option`}
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
        {showAddCriteria && (
          <>
            {regexSelectorComps.map((regexTypeId, i) => {
              const props = {
                dropdownOptions,
                disabledOptions,
                selectedOption: regexTypeId,
                onChangeSelectedOption: (optionValue: string) => {
                  //clear the regex for the selected option, and then update regex selector comps
                },
                onChangeRegexValue,
                onDelete,
                regexInputValue,
              };
            })}
            <div onClick={onClickAddRegexSelector}>
              <Icon glyph="Plus" />
              Add additional criteria
            </div>
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
    </Modal>
  );
};

interface RegexSelectorProps {
  dropdownOptions: RegexSelector[];
  disabledOptions: string[];
  selectedOption: string;
  onChangeSelectedOption: (optionValue: string) => void;
  onChangeRegexValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  regexInputValue: string;
  onDelete: () => void;
}
export const RegexSelectorInput = ({
  dropdownOptions,
  disabledOptions,
  selectedOption,
  onChangeSelectedOption,
  onChangeRegexValue,
  onDelete,
  regexInputValue,
}: RegexSelectorProps) => {
  const dropdownId = uuid();
  const inputId = uuid();
  return (
    <div>
      <SectionLabelContainer>
        <InputLabel htmlFor={dropdownId}>Notification method</InputLabel>
      </SectionLabelContainer>
      <StyledSelect
        id={dropdownId}
        data-test-id="notify-by-select"
        value={selectedOption}
        onChange={onChangeSelectedOption}
      >
        {dropdownOptions.map((s) => (
          <Option
            key={s.type}
            disabled={disabledOptions.includes(s.type)}
            value={s.type}
            data-test-id={`${s.type}-option`}
          >
            {s.typeLabel}
          </Option>
        ))}
      </StyledSelect>
      matches regex
      <SectionLabelContainer>
        <InputLabel htmlFor={inputId}>Regex</InputLabel>
      </SectionLabelContainer>
      <StyledInput
        data-cy={`${selectedOption}-input`}
        id={inputId}
        onChange={onChangeRegexValue}
        value={regexInputValue}
        disabled={!selectedOption}
      />
      <div onClick={onDelete}>
        <Icon glyph="Trash" />
      </div>
    </div>
  );
};

export interface SubscriptionMethodControl {
  label: string;
  placeholder: string;
  targetPath: string;
  validator: (v: string) => boolean;
}

export type ResourceType = "TASK" | "BUILD";

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

const Section = styled.div`
  padding-bottom: 24px;
  margin-bottom: 22px;
  border-bottom: 1px solid ${uiColors.gray.light2};
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
