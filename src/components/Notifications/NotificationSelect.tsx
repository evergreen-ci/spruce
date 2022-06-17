import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import { Body } from "@leafygreen-ui/typography";
import { Select } from "antd";
import get from "lodash/get";
import set from "lodash/set";
import { RegexSelectorInput } from "components/Notifications/NotificationModal/RegexSelectorInput";
import {
  Section,
  InputLabel,
  SectionLabelContainer,
  StyledSelect,
  ExtraFieldContainer,
  StyledInput,
  RegexSelectorInputContainer,
} from "components/Notifications/styles";
import { ErrorMessage } from "components/styles";
import {
  SubscriptionMethodControl,
  SubscriptionMethods,
} from "hooks/useNotificationModal";
import { SubscriptionMethodDropdownOption } from "types/subscription";
import { StringMap, Trigger } from "types/triggers";
import { toSentenceCase } from "utils/string";

const { Option } = Select;

interface NotificationSelectProps {
  triggers: Trigger[];
  subscriptionMethodControls: SubscriptionMethods;
  subscriptionMethodDropdownOptions: SubscriptionMethodDropdownOption[];
  selectedBuildInitiator?: string;
  onChangeSelectedBuildInitiator?: (optionValue: string) => void;
  trigger?: Trigger;
  selectedExtraFieldInputVals?: StringMap;
  disableAddCriteria;
  extraFieldErrorMessages;
  extraFieldInputVals;
  extraFields;
  onClickAddRegexSelector;
  regexSelectorProps;
  selectedSubscriptionMethod;
  selectedTriggerIndex;
  setExtraFieldInputVals;
  setSelectedSubscriptionMethod;
  setSelectedTriggerIndex;
  setTarget;
  showAddCriteria;
  target;
}

// update parent state with no
export const NotificationSelect: React.VFC<NotificationSelectProps> = ({
  subscriptionMethodDropdownOptions,
  subscriptionMethodControls,
  triggers,
  selectedBuildInitiator,
  onChangeSelectedBuildInitiator,
  trigger,
  selectedExtraFieldInputVals,
  disableAddCriteria,
  extraFieldErrorMessages,
  extraFieldInputVals,
  extraFields,
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
}) => {
  const currentMethodControl = subscriptionMethodControls[
    selectedSubscriptionMethod
  ] as SubscriptionMethodControl;

  const label = get(currentMethodControl, "label");
  const placeholder = get(currentMethodControl, "placeholder");
  const targetPath = get(currentMethodControl, "targetPath");

  const currentExtraFields = trigger?.extraFields || extraFields;
  const currentIndex =
    trigger?.trigger === ""
      ? undefined
      : triggers.findIndex((v) => v === trigger);
  const currentSelectedTriggerIndex =
    currentIndex !== -1 ? currentIndex : selectedTriggerIndex;
  const currentExtraFieldInputVals =
    selectedExtraFieldInputVals || extraFieldInputVals || {};

  return (
    <Section>
      <Body weight="medium">Choose an event</Body>
      <SectionLabelContainer>
        <InputLabel htmlFor="event-select">Event</InputLabel>
      </SectionLabelContainer>
      <StyledSelect
        value={currentSelectedTriggerIndex}
        onChange={(v: number) => {
          setSelectedTriggerIndex(v);
        }}
        data-cy="event-select"
        id="event-select"
      >
        {triggers.map((t, i) => (
          <Option
            key={`trigger_${t.trigger}_${t.resourceType}_${t.payloadResourceIdKey}`}
            value={i}
            data-cy={`trigger_${i}-option`}
          >
            {t.label}
          </Option>
        ))}
      </StyledSelect>
      {currentExtraFields &&
        currentExtraFields.map(
          ({ text, key, fieldType, dataCy: inputDataCy, options }) => (
            <ExtraFieldContainer key={key}>
              <SectionLabelContainer>
                <InputLabel htmlFor={`${key}-input`}>{text}</InputLabel>
              </SectionLabelContainer>

              {fieldType === "select" ? (
                <StyledSelect
                  value={
                    text === "Failure Type"
                      ? toSentenceCase(
                          currentExtraFieldInputVals["failure-type"]
                        )
                      : selectedBuildInitiator
                  }
                  onChange={onChangeSelectedBuildInitiator}
                  data-cy="when-select"
                  id="event-select-extraFields"
                >
                  {options?.map((o) => (
                    <Option value={o} key={o}>
                      {o}
                    </Option>
                  ))}
                </StyledSelect>
              ) : (
                <StyledInput
                  data-cy={inputDataCy}
                  aria-labelledby="$extra-field-{key}-input"
                  id={`${key}-input`}
                  onChange={(event) => {
                    setExtraFieldInputVals({
                      ...currentExtraFieldInputVals,
                      [key]: event.target.value,
                    });
                  }}
                  value={currentExtraFieldInputVals[key]}
                />
              )}
            </ExtraFieldContainer>
          )
        )}
      {showAddCriteria && (
        <>
          <RegexSelectorInputContainer>
            {regexSelectorProps.map((props, i) => (
              <RegexSelectorInput
                canDelete
                // eslint-disable-next-line react/no-array-index-key
                key={`${props.dataCyPrefix}_${i}`}
                dataCyPrefix={i}
                {...props}
              />
            ))}
          </RegexSelectorInputContainer>
          <Button
            data-cy="add-regex-selector-button"
            disabled={disableAddCriteria}
            onClick={onClickAddRegexSelector}
          >
            <Icon glyph="Plus" />
            Add Additional Criteria
          </Button>
        </>
      )}
      <>
        <div>
          <Body weight="medium">Choose how to be notified</Body>
          <SectionLabelContainer>
            <InputLabel htmlFor="notify-by-select">
              Notification method
            </InputLabel>
          </SectionLabelContainer>
          <StyledSelect
            id="notify-by-select"
            data-cy="notify-by-select"
            value={selectedSubscriptionMethod}
            onChange={(v: string) => {
              setSelectedSubscriptionMethod(v);
            }}
          >
            {subscriptionMethodDropdownOptions.map((s) => (
              <Option
                key={s.value}
                value={s.value}
                data-cy={`${s.value}-option`}
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
                aria-labelledby={`${targetPath}-input`}
                id="target"
                placeholder={placeholder}
                data-cy={`${targetPath}-input`}
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
            <span key={`field_error_${text}`} data-cy="error-message">
              <ErrorMessage>{text}</ErrorMessage>
            </span>
          ))}
        </div>
      </>
    </Section>
  );
};
