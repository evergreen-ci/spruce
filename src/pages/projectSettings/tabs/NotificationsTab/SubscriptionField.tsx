import { Body } from "@leafygreen-ui/typography";
import { Field } from "@rjsf/core";

export const SubscriptionField: Field = ({ formData }) => {
  const { subscriberType, subscriberName } = formData;
  return (
    <Body>
      <strong> Subscriber type: </strong> {subscriberType} <br />
      <strong> Subscriber: </strong> {subscriberName} <br />
    </Body>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const generateWebhookSecret = () => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 64; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};
