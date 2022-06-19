import { SpruceFormProps } from "components/SpruceForm";
import { SubscriptionMethods, Trigger } from "types/triggers";
import { RegexSelectorRow } from "./RegexSelectorRow";

const hiddenIf = (element: boolean) =>
  element === true && {
    "ui:widget": "hidden",
  };

const constructExtraFields = (extraFields) => {
  if (!extraFields) {
    return {};
  }
  const extraFieldsSchema = {};
  extraFields.forEach((e) => {
    if (e.type === "select") {
      extraFieldsSchema[e] = {
        type: "string" as "string",
        title: e.text,
        oneOf: [
          ...Object.keys(e.options).map((o) => ({
            type: "string" as "string",
            title: o,
            enum: [o],
          })),
        ],
      };
    } else {
      extraFieldsSchema[e] = {
        type: "string" as "string",
        title: e.text,
        format: e.format,
        default: e.default,
        minLength: 1,
      };
    }
  });
  return extraFieldsSchema;
};

// Reminder; give a type to form state
export const getFormSchema = (
  formState,
  triggers: Trigger,
  subscriptionMethods: SubscriptionMethods
): {
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => {
  const selectedMethod =
    subscriptionMethods[formState.notification.notificationSelect];
  const selectedEvent = triggers[formState.event.eventSelect];

  // which CAN contain extraFields and regexSelectors
  // extrafields stuff
  const extraFields = selectedEvent?.extraFields;

  // I think it might make more sense to build this as a field and just do the logic manually
  // regex selector stuff which already looks awful
  const hasRegexSelector = !!selectedEvent?.regexSelectors;
  const usingID = !!formState?.event?.regexSelector?.find(
    (r) => r.regexSelect === "build-variant"
  );
  const usingName = !!formState?.event?.regexSelector?.find(
    (r) => r.regexSelect === "display-name"
  );
  const regexEnumsToDisable = [
    ...(usingID ? ["build-variant"] : []),
    ...(usingName ? ["display-name"] : []),
  ];

  // oof I need to read the state management used for handling regex stuff.
  // console.log("selectedEvent: ", selectedEvent);

  return {
    schema: {
      type: "object" as "object",
      properties: {
        event: {
          type: "object" as "object",
          title: "Choose an Event",
          properties: {
            eventSelect: {
              type: "string" as "string",
              title: "Event",
              oneOf: [
                ...Object.keys(triggers).map((t) => ({
                  type: "string" as "string",
                  title: triggers[t].label,
                  enum: [t],
                })),
              ],
            },
            ...constructExtraFields(extraFields),
            regexSelector: {
              type: "array" as "array",
              maxItems: 2,
              items: {
                type: "object" as "object",
                properties: {
                  regexSelect: {
                    type: "string" as "string",
                    title: "Field name",
                    oneOf: [
                      ...(selectedEvent?.regexSelectors ?? []).map((r) => ({
                        type: "string" as "string",
                        title: r.typeLabel,
                        enum: [r.type],
                      })),
                    ],
                  },
                  regexInput: {
                    type: "string" as "string",
                    title: "Regex",
                    format: "validRegex",
                    minLength: 1,
                  },
                },
              },
            },
          },
        },
        notification: {
          type: "object" as "object",
          title: "Choose How to be Notified",
          required: ["notificationInput"],
          properties: {
            notificationSelect: {
              type: "string" as "string",
              title: "Notification Method",
              oneOf: [
                ...Object.keys(subscriptionMethods).map((method) => ({
                  type: "string" as "string",
                  title: subscriptionMethods[method].dropdown,
                  enum: [method],
                })),
              ],
            },
            notificationInput: {
              type: "string" as "string",
              title: selectedMethod.label,
              format: selectedMethod.format,
              minLength: 1,
            },
          },
        },
      },
    },
    uiSchema: {
      event: {
        eventSelect: {
          "ui:allowDeselect": false,
          "ui:usePortal": false,
          "ui:data-cy": "event-trigger-select",
        },
        regexSelector: {
          "ui:showLabel": false,
          "ui:addToEnd": true,
          "ui:orderable": false,
          "ui:addButtonText": "Add Additional Criteria",
          ...hiddenIf(!hasRegexSelector),
          items: {
            "ui:ObjectFieldTemplate": RegexSelectorRow,
            regexSelect: {
              "ui:allowDeselect": false,
              "ui:usePortal": false,
              "ui:data-cy": "regex-select",
              "ui:disabledEnums": regexEnumsToDisable,
            },
            regexInput: {
              "ui:data-cy": "regex-input",
            },
          },
        },
      },
      notification: {
        notificationSelect: {
          "ui:allowDeselect": false,
          "ui:usePortal": false,
          "ui:data-cy": "notification-method-select",
        },
        notificationInput: {
          "ui:placeholder": selectedMethod.placeholder,
          "ui:data-cy": selectedMethod.targetPath,
        },
      },
    },
  };
};
