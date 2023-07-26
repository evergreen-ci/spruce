import { UserQuery, UserQueryVariables } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { ApolloMock } from "types/gql";

export const getUserMock: ApolloMock<UserQuery, UserQueryVariables> = {
  request: {
    query: GET_USER,
    variables: {},
  },
  result: {
    data: {
      user: {
        __typename: "User",
        displayName: "Evergreen Admin",
        emailAddress: "admin@evergreen.com",
        userId: "admin",
      },
    },
  },
};
