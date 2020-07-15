import { useState, useEffect } from "react";
import get from "lodash/get";
import { RegexSelectorProps } from "components/NotificationModal/RegexSelectorInput";
import { v4 as uuid } from "uuid";
export interface UseNotificationModalProps {
  subscriptionMethodControls: SubscriptionMethods;
  triggers: Trigger[];
  resourceId: string;
}
interface RegexSelectorPropsTemplate {
  key: string;
  regexType: string;
}
export const useNotificationModal = ({
  triggers,
  subscriptionMethodControls,
  resourceId,
}: UseNotificationModalProps) => {
  const [selectedSubscriptionMethod, setSelectedSubscriptionMethod] = useState(
    ""
  );
  // target represents the input value for a subscription method
  const [target, setTarget] = useState<Target>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [extraFieldErrorMessages, setExtraFieldErrorMessages] = useState<
    string[]
  >([]);

  const [selectedTriggerIndex, setSelectedTriggerIndex] = useState<number>();
  const [extraFieldInputVals, setExtraFieldInputVals] = useState<StringMap>({});
  const [regexSelectorInputs, setRegexSelectorInputs] = useState<StringMap>({});
  const [regexSelectorPropsTemplate, setRegexSelectorPropsTemplate] = useState<
    RegexSelectorPropsTemplate[]
  >([{ regexType: "", key: uuid() }]);
  const [regexSelectorProps, setRegexSelectorProps] = useState<
    RegexSelectorProps[]
  >([]);
  const onClickAddRegexSelector = () => {
    setRegexSelectorPropsTemplate([
      ...regexSelectorPropsTemplate,
      { regexType: "", key: uuid() },
    ]);
  };

  // extraFields represents schema additional inputs required for the selected trigger
  const {
    extraFields,
    resourceType,
    payloadResourceIdKey,
    regexSelectors,
    trigger,
  } = get(triggers, `[${selectedTriggerIndex}]`, {});

  useEffect(() => {
    const disabledDropdownOptions = regexSelectorPropsTemplate
      .map(({ regexType }) => regexType)
      .filter((v) => v);
    setRegexSelectorProps(
      regexSelectorPropsTemplate.map(({ regexType, key }, i) => ({
        key,
        dropdownOptions: regexSelectors,
        disabledDropdownOptions,
        selectedOption: regexType,
        onChangeSelectedOption: (optionValue: string) => {
          // reset "previous" option
          if (regexType) {
            setRegexSelectorInputs({
              ...regexSelectorInputs,
              [regexType]: "",
            });
          }
          const regexSelectorPropsTemplateClone = [
            ...regexSelectorPropsTemplate,
          ];
          regexSelectorPropsTemplateClone[i].regexType = optionValue;
          setRegexSelectorPropsTemplate(regexSelectorPropsTemplateClone);
        },
        onChangeRegexValue: (event) => {
          setRegexSelectorInputs({
            ...regexSelectorInputs,
            [regexType]: event.target.value,
          });
        },
        onDelete: () => {
          if (regexType) {
            setRegexSelectorInputs({
              ...regexSelectorInputs,
              [regexType]: "",
            });
          }
          setRegexSelectorPropsTemplate(
            regexSelectorPropsTemplate
              .slice(0, i)
              .concat(
                regexSelectorPropsTemplate.slice(
                  i + 1,
                  regexSelectorPropsTemplate.length
                )
              )
          );
        },
        regexInputValue: regexSelectorInputs[regexType] ?? "",
      }))
    );
  }, [regexSelectorPropsTemplate, regexSelectorInputs, regexSelectors]);

  // clear the input vals for the extraFields and regex selectors when the selected trigger changes
  useEffect(() => {
    setExtraFieldInputVals(
      (extraFields ?? []).reduce(clearExtraFieldsInputCb, {})
    );
    setRegexSelectorPropsTemplate([{ regexType: "", key: uuid() }]);
    setRegexSelectorInputs({});
  }, [selectedTriggerIndex, extraFields]);

  // reset Targets when subscription method changes
  useEffect(() => {
    setTarget({});
  }, [selectedSubscriptionMethod]);

  // handles populating an error messages error array for the extra fields
  useEffect(() => {
    if (!extraFields) {
      setExtraFieldErrorMessages([]);
      return;
    }
    const extraFieldInputValEntries = Object.entries(extraFieldInputVals);
    const nextErrorMessages = extraFieldInputValEntries
      .map(([fieldName, fieldVal]) => {
        // get the validator for the extra field
        const validator = get(
          extraFields.find(({ key }) => key === fieldName),
          "validator",
          () => ""
        );
        // validator returns an error message or an empty string
        return validator(fieldVal);
      })
      .filter((v) => v); // filter out empty strings
    setExtraFieldErrorMessages(nextErrorMessages);
  }, [extraFieldInputVals, extraFields, setExtraFieldErrorMessages]);

  useEffect(() => {
    const targetEntries = Object.entries(target);
    // check that required fields exist and there are no extra field errors
    if (
      !targetEntries.length ||
      selectedTriggerIndex === undefined ||
      !selectedSubscriptionMethod ||
      extraFieldErrorMessages.length ||
      // if regex selectors are options for the selected trigger,
      // make sure that at least one option is filled
      (regexSelectors &&
        regexSelectors.length &&
        !Object.entries(regexSelectorInputs).filter((v) => v[1]).length)
    ) {
      setIsFormValid(false);
      return;
    }
    // check that subscription methods input has the correct value
    // targetEntries should only ever be length 1
    const isTargetValid = targetEntries.reduce(
      (accum, [tName, tVal]) =>
        accum && subscriptionMethodControls[tName].validator(tVal),
      true
    );
    setIsFormValid(isTargetValid);
  }, [
    subscriptionMethodControls,
    target,
    extraFieldInputVals,
    selectedTriggerIndex,
    selectedSubscriptionMethod,
    extraFieldErrorMessages,
    regexSelectorInputs,
    regexSelectors,
  ]);

  const getRequestPayload = () => {
    const targetEntry = Object.entries(target)[0];
    return {
      trigger,
      resource_type: resourceType,
      selectors: [
        { type: "object", data: resourceType.toLowerCase() },
        { type: payloadResourceIdKey, data: resourceId },
      ],
      subscriber: {
        type: targetEntry[0],
        target: targetEntry[1],
      },
      trigger_data: extraFieldInputVals,
      owner_type: "person",
      regex_selectors: Object.entries(regexSelectorInputs)
        .filter((v) => v[1])
        .map(([type, data]) => ({ type, data })),
    };
  };

  const isDisabledAddCriteria =
    regexSelectorProps.length >= get(regexSelectors, "length", 0);

  return {
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
    showAddCriteria: !!regexSelectors,
    isDisabledAddCriteria,
    target,
  };
};

interface Target {
  "jira-comment"?: string;
  email?: string;
  slack?: string;
}
type ResourceType = "TASK" | "VERSION" | "BUILD";
interface StringMap {
  [index: string]: string;
}

const clearExtraFieldsInputCb = (accum: StringMap, eF: ExtraField) => ({
  ...accum,
  [eF.key]: "10",
});
interface ExtraField {
  text: string;
  key: string;
  validator: (v: any) => string;
  dataCy: string;
}

type RegexSelectorType = "display-name" | "build-variant";
export interface RegexSelector {
  type: RegexSelectorType;
  typeLabel: string;
}

type PayloadResourceIdKey = "in-version" | "in-build" | "id";
export interface Trigger {
  trigger: string;
  label: string;
  extraFields?: ExtraField[];
  resourceType: ResourceType;
  payloadResourceIdKey: PayloadResourceIdKey;
  regexSelectors?: RegexSelector[];
}
export interface SubscriptionMethodControl {
  label: string;
  placeholder: string;
  targetPath: string;
  validator: (v: string) => boolean;
}

export interface SubscriptionMethods {
  "jira-comment": SubscriptionMethodControl;
  email: SubscriptionMethodControl;
  slack: SubscriptionMethodControl;
}
