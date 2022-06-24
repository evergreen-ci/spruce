import { NotificationMethods } from "types/subscription";
import { Trigger, ExtraField } from "types/triggers";
import { FormState, FormExtraFields, FormRegexSelector } from "./types";

export const getRegexEnumsToDisable = (regexForm: FormRegexSelector[]) => {
  const usingID = !!regexForm.find((r) => r.regexSelect === "build-variant");
  const usingName = !!regexForm.find((r) => r.regexSelect === "display-name");
  const regexEnumsToDisable = [
    ...(usingID ? ["build-variant"] : []),
    ...(usingName ? ["display-name"] : []),
  ];
  return regexEnumsToDisable;
};

const getTargetForMethod = (method: string) => {
  switch (method) {
    case NotificationMethods.JIRA_COMMENT:
      return "jiraCommentInput";
    case NotificationMethods.SLACK:
      return "slackInput";
    case NotificationMethods.EMAIL:
      return "emailInput";
    default:
      return "";
  }
};

// Converts the form regexSelector into the proper format for GQL payload.
// We need to check if the trigger has regex selectors because it's possible for data
// from other dependencies to persist.
const regexFormToGql = (
  hasRegexSelectors: boolean,
  regexForm: FormRegexSelector[]
) =>
  hasRegexSelectors
    ? regexForm.map((r) => ({
        type: r.regexSelect,
        data: r.regexInput,
      }))
    : [];

// Converts the form extraFields into the proper format for GQL payload.
// We need to check what extraFields exist for a particular trigger because it's possible
// for data from other dependencies to persist.
const extraFieldsFormToGql = (
  extraFieldsToInclude: ExtraField[],
  extraFieldsForm: FormExtraFields
) => {
  // If there are no extra fields for this trigger, just return.
  if (!extraFieldsToInclude) {
    return {};
  }
  const extraFields = {};
  extraFieldsToInclude.forEach((e) => {
    extraFields[e.key] = extraFieldsForm[e.key];
  });
  console.log(extraFields);
  return extraFields;
};

export const getGqlPayload = (
  triggers: Trigger,
  resourceId: string,
  formState: FormState
) => {
  const triggerEvent = triggers[formState.event.eventSelect];
  const {
    payloadResourceIdKey,
    resourceType,
    trigger,
    extraFields,
    regexSelectors,
  } = triggerEvent;

  const method = formState.notification.notificationSelect;
  const subscriber = formState.notification[getTargetForMethod(method)];
  const triggerData = extraFieldsFormToGql(
    extraFields,
    formState.event.extraFields
  );
  const regexData = regexFormToGql(
    !!regexSelectors,
    formState.event.regexSelector
  );

  return {
    trigger,
    resource_type: resourceType,
    selectors: [
      { type: "object", data: resourceType.toLowerCase() },
      { type: payloadResourceIdKey, data: resourceId },
    ],
    subscriber: {
      type: method,
      target: subscriber,
    },
    trigger_data: triggerData,
    regex_selectors: regexData,
    owner_type: "person",
  };
};
