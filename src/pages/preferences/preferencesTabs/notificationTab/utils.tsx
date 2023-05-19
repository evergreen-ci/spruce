import styled from "@emotion/styled";
import { LeafyGreenTableRow } from "@leafygreen-ui/table/new";
import { getPatchRoute, getTaskRoute, getVersionRoute } from "constants/routes";
import { size } from "constants/tokens";
import { GeneralSubscription, Selector } from "gql/generated/types";
import { ResourceType } from "types/triggers";

export const processSubscriptionData = (
  subscriptions: GeneralSubscription[]
) => {
  if (!subscriptions || !subscriptions.length) {
    return;
  }

  return (
    subscriptions
      // Filter out a user's global subscriptions for tasks, spawn hosts, etc.
      .filter((subscription) =>
        subscription.selectors.find(
          (s) =>
            s.type !== "object" && (s.type === "id" || s.type.startsWith("in-"))
        )
      )
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

export const getResourceRoute = (resourceType: ResourceType, id: string) => {
  if (!id) {
    return "";
  }

  switch (resourceType) {
    case ResourceType.Build:
    case ResourceType.Version:
      return getVersionRoute(id);
    case ResourceType.Patch:
      return getPatchRoute(id, { configure: false });
    case ResourceType.Task:
      return getTaskRoute(id);
    default:
      return "";
  }
};

export const formatRegexSelectors = (regexSelectors: Selector[]) => ({
  "regex-selectors": regexSelectors.reduce(
    (obj, { data, type }) => ({
      ...obj,
      [type]: data,
    }),
    {}
  ),
});
