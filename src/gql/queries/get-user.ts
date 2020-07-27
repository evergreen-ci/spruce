import gql from "graphql-tag";

export const GET_USER = gql`
  query GetUser {
    user {
      userId
      displayName
    }
  }
`;

export const GET_OTHER_USER = gql`
  query GetOtherUser($userId: String) {
    otherUser: user(userId: $userId) {
      userId
      displayName
    }
    currentUser: user {
      userId
    }
  }
`;
