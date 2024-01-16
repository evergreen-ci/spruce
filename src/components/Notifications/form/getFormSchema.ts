import { SpruceFormProps } from "components/SpruceForm/types";
import { SubscriptionMethodOption } from "types/subscription";
import { Trigger } from "types/triggers";
import { getEventSchema } from "./event";
import { getNotificationSchema } from "./notification";

export const getFormSchema = (
  regexEnumsToDisable: string[],
  triggers: Trigger,
  subscriptionMethods: SubscriptionMethodOption[],
): {
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => {
  const { schema: eventSchema, uiSchema: eventUiSchema } = getEventSchema(
    regexEnumsToDisable,
    triggers,
  );
  const { schema: notificationSchema, uiSchema: notificationUiSchema } =
    getNotificationSchema(subscriptionMethods);

  return {
    schema: {
      type: "object" as "object",
      properties: {
        event: eventSchema,
        notification: notificationSchema,
      },
    },
    uiSchema: {
      event: eventUiSchema,
      notification: notificationUiSchema,
    },
  };
};
