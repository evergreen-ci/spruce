import { gql } from "@apollo/client";

export const SAVE_SUBSCRIPTION = gql`
  mutation SaveSubscription($subscription: SubscriptionInput!) {
    saveSubscription(subscription: $subscription)
  }
`;
