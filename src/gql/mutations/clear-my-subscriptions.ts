import { gql } from "@apollo/client";

export const CLEAR_MY_SUBSCRIPTIONS = gql`
  mutation ClearMySubscriptions {
    clearMySubscriptions
  }
`;
