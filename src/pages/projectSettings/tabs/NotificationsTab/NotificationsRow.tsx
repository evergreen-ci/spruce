import styled from "@emotion/styled";
import { v4 as uuid } from "uuid";
import { NotificationSelect } from "components/Notifications/NotificationSelect";
import {
  triggers,
  subscriptionMethodControls,
  subscriptionMethodDropdownOptions,
} from "constants/triggers";
import { SubscriptionsFragment } from "gql/generated/types";
import { useNotificationModal } from "hooks/useNotificationModal";

import { StringMap, Trigger } from "types/triggers";

export type RegexItem = {
  regexType: string;
  key: uuid;
  regexValue: string;
};

export const getCurrentRegexSelectors = (
  selectors: {
    type: string;
    data: string;
  }[]
) => {
  const regexSelectors: RegexItem[] = [];

  selectors?.forEach((s) => {
    const item = {
      regexType: s.type,
      key: uuid(),
      regexValue: s.data,
    };

    regexSelectors.push(item);
  });
  return regexSelectors;
};

interface SubscriptionSelectProps {
  resourceType: string;
  trigger: Trigger;
  selectedExtraFieldInputVals: StringMap;
  // todo: use in future work
  selectors: SubscriptionsFragment["selectors"];
  regexSelectors: SubscriptionsFragment["regexSelectors"];
  buildInitiator: string;
}

export const SubscriptionSelect: React.VFC<SubscriptionSelectProps> = ({
  trigger,
  selectedExtraFieldInputVals,
  buildInitiator,
  regexSelectors,
}) => {
  const type = "version";
  const resourceId = "project-id";
  const currentIndex =
    trigger?.trigger === ""
      ? undefined
      : triggers.findIndex((v) => v === trigger);

  const {
    extraFieldInputVals,
    buildInitiatorSelected,
    setBuildInitiatorSelected,
  } = useNotificationModal({
    subscriptionMethodControls,
    triggers,
    resourceId,
    type,
    currentRegexSelectors: getCurrentRegexSelectors(regexSelectors),
    currentTriggerIndex: currentIndex,
  });

  const currentBuildInitiator = buildInitiator || buildInitiatorSelected || "";
  const currentExtraFieldInputVals =
    selectedExtraFieldInputVals || extraFieldInputVals || {};

  return (
    <RowContainer>
      <NotificationSelect
        triggers={triggers}
        subscriptionMethodControls={subscriptionMethodControls}
        subscriptionMethodDropdownOptions={subscriptionMethodDropdownOptions}
        type={type}
        selectedBuildInitiator={currentBuildInitiator}
        trigger={trigger}
        onChangeSelectedBuildInitiator={setBuildInitiatorSelected}
        selectedExtraFieldInputVals={currentExtraFieldInputVals}
        resourceId={resourceId}
      />
    </RowContainer>
  );
};

const RowContainer = styled.div`
  margin-bottom: 16px;
`;
