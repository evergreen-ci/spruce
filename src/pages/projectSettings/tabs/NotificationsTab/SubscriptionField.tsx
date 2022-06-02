import styled from "@emotion/styled";
import ExpandableCard from "@leafygreen-ui/expandable-card";
import { Body } from "@leafygreen-ui/typography";

import { Field } from "@rjsf/core";
import { size } from "constants/tokens";
import { triggers } from "constants/triggers";
import { Subscriber, SubscriptionsFragment } from "gql/generated/types";
import { ResourceType, StringMap, Trigger } from "types/triggers";
import { toSentenceCase } from "utils/string";
import { SubscriptionSelect } from "./NotificationsRow";

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

const getTrigger = (trigger: string, resourceType: string): Trigger => {
  const foundTrigger = triggers.find(
    (t) => t.trigger === trigger && t.resourceType === resourceType
  );

  return (
    foundTrigger ?? {
      trigger: "",
      resourceType: ResourceType.VERSION,
      regexSelectors: [],
      label: "",
    }
  );
};

export const getBuildInitiator = (
  selectors: SubscriptionsFragment["selectors"]
) => {
  if (selectors === undefined) {
    return "";
  }
  let b = "";
  selectors.forEach((key) => {
    if (key.type === "requester") {
      b = key.data;
    }
  });

  let initiator = "";
  switch (b) {
    case "gitter_request":
      initiator = "Commit";
      break;
    case "patch_request":
      initiator = "Patch";
      break;
    case "github_pull_request":
      initiator = "Pull Request";
      break;
    case "merge_test":
      initiator = "Commit Queue";
      break;
    case "ad_hoc":
      initiator = "Periodic Build";
      break;
    default:
      initiator = "";
  }

  return initiator;
};

export const SubscriptionField: Field = ({ formData }) => {
  const {
    resourceType,
    trigger,
    triggerData,
    selectors,
    regexSelectors,
    subscriber,
  } = formData;

  const subscriberType = getSubscriberType(subscriber);
  const subscriberName = subscriber ? subscriber[subscriberType] : "";
  const triggerDefaults = getTrigger(trigger, resourceType);

  const title =
    resourceType && trigger && subscriberName
      ? `${toSentenceCase(resourceType)} ${trigger} ${subscriberName}`
      : "New Subscription";

  return (
    <StyledExpandableCard
      defaultOpen
      contentClassName="subscription-card-content"
      title={
        <>
          <TitleWrapper data-cy="expandable-card-title">{title}</TitleWrapper>
        </>
      }
    >
      <Body>
        <SubscriptionSelect
          resourceType={resourceType}
          trigger={triggerDefaults}
          selectors={selectors}
          regexSelectors={regexSelectors}
          buildInitiator={getBuildInitiator(selectors)}
          selectedExtraFieldInputVals={triggerData as StringMap}
        />
        <br />
        {/* todo: display properly */}
        <strong>subscriberType: </strong> {subscriberType} <br />
        <strong>subscriber: </strong> {subscriberName} <br />
      </Body>
    </StyledExpandableCard>
  );
};

const TitleWrapper = styled.span`
  margin-right: ${size.s};
`;

const StyledExpandableCard = styled(ExpandableCard)`
  margin-bottom: ${size.l};
  width: 150%;
`;
