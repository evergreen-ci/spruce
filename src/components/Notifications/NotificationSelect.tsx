import React from "react";
import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import { Body } from "@leafygreen-ui/typography";
import { Select } from "antd";
import {
  RegexSelectorInput,
  RegexSelectorProps,
} from "components/Notifications/NotificationModal/RegexSelectorInput";
import {
  Section,
  InputLabel,
  SectionLabelContainer,
  StyledSelect,
  ExtraFieldContainer,
  StyledInput,
  RegexSelectorInputContainer,
} from "components/Notifications/styles";
import { ExtraField, StringMap, Trigger } from "types/triggers";
import { toSentenceCase } from "utils/string";

const { Option } = Select;

interface NotificationSelectProps {
  triggers: Trigger[];
  extraFields: ExtraField[];
  selectedTriggerIndex: number;
  showAddCriteria: boolean;
  setSelectedTriggerIndex: (v: number) => void;
  extraFieldInputVals: StringMap;
  setExtraFieldInputVals: React.Dispatch<React.SetStateAction<StringMap>>;
  regexSelectorProps: RegexSelectorProps[];
  disableAddCriteria: boolean;
  onClickAddRegexSelector: () => void;
  onChangeSelectedBuildInitiator?: (optionValue: string) => void;
  selectedBuildInitiator?: string;
}

export const NotificationSelect: React.VFC<NotificationSelectProps> = ({
  triggers,
  extraFields,
  selectedTriggerIndex,
  showAddCriteria,
  setSelectedTriggerIndex,
  extraFieldInputVals,
  setExtraFieldInputVals,
  regexSelectorProps,
  disableAddCriteria,
  onClickAddRegexSelector,
  onChangeSelectedBuildInitiator,
  selectedBuildInitiator,
}) => (
  <Section>
    <Body weight="medium">Choose an event</Body>
    <SectionLabelContainer>
      <InputLabel htmlFor="event-select">Event</InputLabel>
    </SectionLabelContainer>
    <StyledSelect
      value={selectedTriggerIndex}
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
    {extraFields &&
      extraFields.map(({ text, key, type, dataCy: inputDataCy, options }) => (
        <ExtraFieldContainer key={key}>
          <SectionLabelContainer>
            <InputLabel htmlFor={`${key}-input`}>{text}</InputLabel>
          </SectionLabelContainer>

          {type === "select" ? (
            <StyledSelect
              value={
                text === "Failure Type"
                  ? toSentenceCase(extraFieldInputVals["failure-type"])
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
              id={`${key}-input`}
              onChange={(event) => {
                setExtraFieldInputVals({
                  ...extraFieldInputVals,
                  [key]: event.target.value,
                });
              }}
              value={extraFieldInputVals[key]}
            />
          )}
        </ExtraFieldContainer>
      ))}
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
  </Section>
);
