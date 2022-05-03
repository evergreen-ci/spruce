import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import get from "lodash/get";
import { v4 as uuid } from "uuid";
import { RegexSelectorProps } from "components/NotificationModal/RegexSelectorInput";
import {
  getNotificationTriggerCookie,
  SUBSCRIPTION_METHOD,
} from "constants/cookies";
import { clearExtraFieldsInputCb } from "constants/triggers";
import { GetUserSettingsQuery, GetUserQuery } from "gql/generated/types";
import { GET_USER_SETTINGS, GET_USER } from "gql/queries";
import { SUBSCRIPTION_SLACK, SUBSCRIPTION_EMAIL } from "types/subscription";
import { Trigger } from "types/triggers";

export interface UseNotificationModalProps {
  subscriptionMethodControls: SubscriptionMethods;
  triggers: Trigger[];
  resourceId: string;
  type: string;
}
interface RegexSelectorPropsTemplate {
  key: string;
  regexType: string;
}
export const useNotificationModal = ({
  triggers,
  subscriptionMethodControls,
  resourceId,
  type,
}: UseNotificationModalProps) => {
  // USER SETTINGS QUERY
  const { data: userSettingsData } = useQuery<GetUserSettingsQuery>(
    GET_USER_SETTINGS
  );

  // USER QUERY
  const { data: userData } = useQuery<GetUserQuery>(GET_USER);
  const slackUsername = userSettingsData?.userSettings?.slackUsername;
  const emailAddress = userData?.user?.emailAddress;

  const [
    selectedSubscriptionMethod,
    setSelectedSubscriptionMethod,
  ] = useState(() => Cookies.get(SUBSCRIPTION_METHOD));
  // target represents the input value for a subscription method
  const [target, setTarget] = useState<Target>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [extraFieldErrorMessages, setExtraFieldErrorMessages] = useState<
    string[]
  >([]);

  const [selectedTriggerIndex, setSelectedTriggerIndex] = useState<number>(() =>
    parseInt(Cookies.get(getNotificationTriggerCookie(type)) || "0", 10)
  );
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
  } = triggers[selectedTriggerIndex] || {};

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
    selectedTriggerIndex,
    selectedSubscriptionMethod,
    extraFieldErrorMessages,
    regexSelectorInputs,
    regexSelectors,
  ]);

  useEffect(() => {
    switch (selectedSubscriptionMethod) {
      case SUBSCRIPTION_SLACK.value:
        if (slackUsername && slackUsername !== "") {
          setTarget({ slack: `@${slackUsername}` });
        }
        break;
      case SUBSCRIPTION_EMAIL.value:
        if (emailAddress && emailAddress !== "") {
          setTarget({ email: emailAddress });
        }
        break;
      default:
        break;
    }
  }, [selectedSubscriptionMethod, slackUsername, emailAddress]); // eslint-disable-line react-hooks/exhaustive-deps

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
        .map(([t, data]) => ({ type: t, data })),
    };
  };

  const disableAddCriteria =
    regexSelectorPropsTemplate.length >= (regexSelectors?.length ?? 0);

  const onChangeSubscriptionMethod = (v: string) => {
    setSelectedSubscriptionMethod(v);
    Cookies.set(SUBSCRIPTION_METHOD, v, { expires: 365 });
  };

  const onChangeTrigger = (v: number) => {
    setSelectedTriggerIndex(v);
    Cookies.set(`${type}-notification-trigger`, `${v}`, { expires: 365 });
  };
  return {
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
    setSelectedSubscriptionMethod: onChangeSubscriptionMethod,
    setSelectedTriggerIndex: onChangeTrigger,
    setTarget,
    showAddCriteria: (regexSelectors?.length ?? 0) > 0,
    target,
  };
};

interface Target {
  "jira-comment"?: string;
  email?: string;
  slack?: string;
}

interface StringMap {
  [index: string]: string;
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
