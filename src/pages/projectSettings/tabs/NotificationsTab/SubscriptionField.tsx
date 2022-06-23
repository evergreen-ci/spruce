import { Body } from "@leafygreen-ui/typography";
import { Field } from "@rjsf/core";
import { Subscriber } from "gql/generated/types";

const getSubscriberType = (subscriber: Subscriber) => {
  if (subscriber === undefined) {
    return "";
  }
  let key: string = "";
  Object.keys(subscriber).forEach((k) => {
    if (subscriber[k] !== null) {
      key = k;
    }
  });
  return key;
};

export const SubscriptionField: Field = ({ formData }) => {
  const { subscriber } = formData;
  const subscriberType = getSubscriberType(subscriber);
  const subscriberName = subscriber
    ? subscriber[subscriberType]
    : "just-a-fake-name";

  return (
    <Body>
      {/* TODO in EVG-16971: display properly */}
      <strong>subscriberType: </strong> {subscriberType} <br />
      <strong>subscriber: </strong> {subscriberName} <br />
    </Body>
  );
};
