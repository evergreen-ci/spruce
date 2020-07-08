import { useState, useEffect } from "react";
import get from "lodash.get";

export interface UseNotificationModalProps {
  subscriptionMethodControls: SubscriptionMethods;
  triggers: Trigger[];
  resourceId: string;
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

  const [selectedTriggerId, setSelectedTriggerId] = useState<string>("");
  const [extraFieldInputVals, setExtraFieldInputVals] = useState<
    ExtraFieldInputVals
  >({});

  // extraFields represents schema additional inputs required for the selected trigger
  const { extraFields, resourceType } =
    triggers.find(({ trigger }) => trigger === selectedTriggerId) ?? {};

  // clear the input vals for the extraFields when the extraFields change
  useEffect(() => {
    setExtraFieldInputVals(
      (extraFields ?? []).reduce(clearExtraFieldsInputCb, {})
    );
  }, [extraFields]);

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
      !selectedTriggerId ||
      !selectedSubscriptionMethod ||
      extraFieldErrorMessages.length
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
    selectedTriggerId,
    selectedSubscriptionMethod,
    extraFieldErrorMessages,
  ]);

  const getRequestPayload = () => {
    const targetEntry = Object.entries(target)[0];
    return {
      trigger: selectedTriggerId,
      resource_type: resourceType,
      selectors: [
        { type: "object", data: resourceType.toLowerCase() },
        { type: "id", data: resourceId },
      ],
      subscriber: {
        type: targetEntry[0],
        target: targetEntry[1],
      },
      trigger_data: extraFieldInputVals,
      owner_type: "person",
      regex_selectors: [],
    };
  };

  return {
    extraFieldErrorMessages,
    extraFieldInputVals,
    extraFields,
    isFormValid,
    target,
    selectedSubscriptionMethod,
    selectedTriggerId,
    setExtraFieldInputVals,
    setSelectedSubscriptionMethod,
    setSelectedTriggerId,
    setTarget,
    getRequestPayload,
  };
};

interface Target {
  "jira-comment"?: string;
  email?: string;
  slack?: string;
}
type ResourceType = "TASK" | "VERSION";
interface ExtraFieldInputVals {
  [index: string]: string;
}
const clearExtraFieldsInputCb = (
  accum: ExtraFieldInputVals,
  eF: ExtraField
) => ({
  ...accum,
  [eF.key]: "10",
});
interface ExtraField {
  text: string;
  key: string;
  validator: (v: any) => string;
}
export interface Trigger {
  trigger: string;
  label: string;
  extraFields?: ExtraField[];
  resourceType: ResourceType;
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
