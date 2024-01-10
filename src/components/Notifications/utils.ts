import { NotificationMethods } from "types/subscription";
import { Trigger, ExtraField, StringMap } from "types/triggers";
import { FormState, FormExtraFields, FormRegexSelector } from "./types";

// This utils file contains functions used to process the form state.

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
  regexForm: FormRegexSelector[],
) =>
  hasRegexSelectors && regexForm
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
  extraFieldsForm: FormExtraFields,
): StringMap => {
  // If there are no extra fields for this trigger, just return.
  if (!extraFieldsToInclude) {
    return {};
  }
  const extraFields = {};
  extraFieldsToInclude.forEach((e) => {
    extraFields[e.key] = extraFieldsForm[e.key].toString();
  });
  return extraFields;
};

export const getGqlPayload = (
  type: "task" | "version" | "project",
  triggers: Trigger,
  resourceId: string,
  formState: FormState,
) => {
  const event = triggers[formState.event.eventSelect];
  const {
    extraFields,
    payloadResourceIdKey,
    regexSelectors,
    resourceType,
    trigger,
  } = event;

  const triggerData = extraFieldsFormToGql(
    extraFields,
    formState.event.extraFields,
  );

  const regexData = regexFormToGql(
    !!regexSelectors,
    formState.event.regexSelector,
  );

  const method = formState.notification.notificationSelect;
  const subscriber = formState.notification[getTargetForMethod(method)];

  const selectors =
    type === "project"
      ? [
          { type: "project", data: resourceId },
          { type: "requester", data: triggerData.requester },
        ]
      : [
          { type: "object", data: resourceType.toLowerCase() },
          { type: payloadResourceIdKey, data: resourceId },
        ];

  return {
    owner_type: "person",
    regex_selectors: regexData,
    resource_type: resourceType,
    selectors,
    subscriber: {
      type: method,
      target: subscriber,
    },
    trigger,
    trigger_data: triggerData,
  };
};

export const hasInitialError = (formState: FormState) => {
  const trigger = formState.event.eventSelect;
  const method = formState.notification.notificationSelect;
  const target = formState.notification[getTargetForMethod(method)];
  if (!trigger || !method || !target) {
    return true;
  }
  return false;
};
