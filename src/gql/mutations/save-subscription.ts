import gql from "graphql-tag";

export const SAVE_SUBSCRIPTION = gql`
  mutation SaveSubscription($subscription: SubscriptionInput!) {
    saveSubscription(subscription: $subscription)
  }
`;
