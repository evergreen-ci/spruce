import { UserQuery, UserQueryVariables } from "gql/generated/types";
import { USER } from "gql/queries";
import { ApolloMock } from "types/gql";

export const getUserMock: ApolloMock<UserQuery, UserQueryVariables> = {
  request: {
    query: USER,
    variables: {},
  },
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "admin",
        displayName: "Evergreen Admin",
        emailAddress: "admin@evergreen.com",
        permissions: {
          canEditAdminSettings: true,
        },
      },
    },
  },
};
