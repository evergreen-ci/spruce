import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { LeafyGreenTableRow } from "@leafygreen-ui/table";
import { size } from "constants/tokens";
import { fromFamilyTrigger } from "constants/triggers";
import {
  UserSubscriptionsQuery,
  UserSubscriptionsQueryVariables,
  GeneralSubscription,
  Selector,
} from "gql/generated/types";
import { USER_SUBSCRIPTIONS } from "gql/queries";

export const useSubscriptionData = () => {
  const { data } = useQuery<
    UserSubscriptionsQuery,
    UserSubscriptionsQueryVariables
  >(USER_SUBSCRIPTIONS);

  const globalSubscriptionIds = useMemo(() => {
    const {
      buildBreakId,
      commitQueueId,
      patchFinishId,
      patchFirstFailureId,
      spawnHostExpirationId,
      spawnHostOutcomeId,
    } = data?.userSettings?.notifications ?? {};
    return new Set([
      buildBreakId,
      commitQueueId,
      patchFinishId,
      patchFirstFailureId,
      spawnHostExpirationId,
      spawnHostOutcomeId,
    ]);
  }, [data?.userSettings?.notifications]);

  const subscriptions = useMemo(
    () =>
      processSubscriptionData(data?.user?.subscriptions, globalSubscriptionIds),
    [data?.user?.subscriptions, globalSubscriptionIds]
  );

  return subscriptions;
};

const processSubscriptionData = (
  subscriptions: GeneralSubscription[],
  globalSubscriptionIds: Set<string>
) => {
  if (!subscriptions || !subscriptions.length) {
    return;
  }

  return (
    subscriptions
      // Filter out a user's global subscriptions for tasks, spawn hosts, etc.
      .filter(({ id }) => !globalSubscriptionIds.has(id))
      // For this table's purposes, FAMILY_TRIGGER = TRIGGER. Convert all family triggers to their base type.
      .map(({ trigger, ...subscription }) => ({
        ...subscription,
        trigger: fromFamilyTrigger(trigger),
      }))
      // For subscriptions that contain regex selectors or additional trigger data, append an expandable section
      .map((subscription) => {
        const hasTriggerData = !!Object.entries(subscription.triggerData ?? {})
          .length;
        const hasRegexSelectors = !!subscription.regexSelectors.length;
        return hasTriggerData || hasRegexSelectors
          ? {
              ...subscription,
              renderExpandedContent: (
                row: LeafyGreenTableRow<GeneralSubscription>
              ) => (
                <ExpandedBlock data-cy="expanded-block">
                  {hasTriggerData && (
                    <div data-cy="trigger-data">
                      {JSON.stringify(row.original.triggerData, null, 2)}
                    </div>
                  )}
                  {hasRegexSelectors && (
                    <div data-cy="regex-selectors">
                      {JSON.stringify(
                        formatRegexSelectors(row.original.regexSelectors),
                        null,
                        2
                      )}
                    </div>
                  )}
                </ExpandedBlock>
              ),
            }
          : subscription;
      })
  );
};

const ExpandedBlock = styled.pre`
  padding: ${size.s} ${size.l};
`;

const formatRegexSelectors = (regexSelectors: Selector[]) => ({
  "regex-selectors": regexSelectors.reduce<Record<string, string>>(
    (obj, { data, type }) => ({
      ...obj,
      [type]: data,
    }),
    {}
  ),
});
