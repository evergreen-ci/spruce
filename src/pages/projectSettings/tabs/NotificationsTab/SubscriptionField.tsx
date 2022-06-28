import { Body } from "@leafygreen-ui/typography";
import { Field } from "@rjsf/core";

export const SubscriptionField: Field = ({ formData }) => {
  const { subscriberType, subscriberName } = formData;
  return (
    <Body>
      <strong>Subscriber type: </strong> {subscriberType} <br />
      <strong>Subscriber: </strong> {subscriberName} <br />
    </Body>
  );
};
